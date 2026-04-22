export function formatStat(value: number | null) {
	if (value === null || Number.isNaN(value)) {
		return '--'
	}

	if (value >= 1_000_000) {
		return `${(value / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
	}

	if (value >= 1_000) {
		return `${(value / 1_000).toFixed(1).replace(/\.0$/, '')}k`
	}

	return String(value)
}

type CloudflareRequestInit = RequestInit & {
	cf?: {
		cacheTtl?: number
		cacheEverything?: boolean
	}
}

type ReadJsonResult<T> =
	| { success: true; data: T }
	| { success: false; data: null }

type MemoryCacheEntry = {
	expiresAt: number
	data: unknown
}

const memoryCache = new Map<string, MemoryCacheEntry>()
const inFlight = new Map<string, Promise<ReadJsonResult<unknown>>>()

function getMemoryCached<T>(key: string): T | null {
	const entry = memoryCache.get(key)
	if (!entry) {
		return null
	}

	if (Date.now() >= entry.expiresAt) {
		memoryCache.delete(key)
		return null
	}

	return entry.data as T
}

function setMemoryCached<T>(key: string, data: T, cacheTtlSeconds: number) {
	memoryCache.set(key, {
		data,
		expiresAt: Date.now() + cacheTtlSeconds * 1000,
	})
}

function getCloudflareCacheRequest(url: string) {
	return new Request(`https://glinter-cache.internal/?url=${encodeURIComponent(url)}`)
}

export async function readJson<T>(url: string, cacheTtlSeconds: number) {
	const memoryKey = `read-json:${url}`
	const memoryCached = getMemoryCached<T>(memoryKey)
	if (memoryCached !== null) {
		return { success: true, data: memoryCached } as ReadJsonResult<T>
	}

	const pending = inFlight.get(memoryKey)
	if (pending) {
		return (await pending) as ReadJsonResult<T>
	}

	const loading = (async () => {
		const sharedCache = (globalThis.caches as unknown as { default: Cache })?.default
		const cacheRequest = getCloudflareCacheRequest(url)
		if (sharedCache) {
			const cachedResponse = await sharedCache.match(cacheRequest)
			if (cachedResponse) {
				const data = (await cachedResponse.json()) as T
				setMemoryCached(memoryKey, data, cacheTtlSeconds)
				return { success: true, data } as ReadJsonResult<T>
			}
		}

		try {
			const requestInit: CloudflareRequestInit = {
				headers: {
					Accept: 'application/json',
					'User-Agent': 'glinter-web',
				},
				cf: {
					cacheEverything: true,
					cacheTtl: cacheTtlSeconds,
				},
			}

			const response = await fetch(url, requestInit)

			if (!response.ok) {
				return { success: false, data: null } as ReadJsonResult<T>
			}

			const data = (await response.json()) as T
			setMemoryCached(memoryKey, data, cacheTtlSeconds)

			if (sharedCache) {
				await sharedCache.put(
					cacheRequest,
					new Response(JSON.stringify(data), {
						headers: {
							'Cache-Control': `public, s-maxage=${cacheTtlSeconds}`,
							'Content-Type': 'application/json',
						},
					}),
				)
			}

			return { success: true, data } as ReadJsonResult<T>
		} catch {
			return { success: false, data: null } as ReadJsonResult<T>
		}
	})()

	inFlight.set(memoryKey, loading as Promise<ReadJsonResult<unknown>>)
	const result = await loading
	inFlight.delete(memoryKey)
	return result as ReadJsonResult<T>
}
