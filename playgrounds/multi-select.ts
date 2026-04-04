import { multiselect } from '@clack/prompts';

const additionalTools = await multiselect({
  message: 'Select additional tools.',
  options: [
    { value: 'eslint', label: 'ESLint', hint: 'recommended' },
    { value: 'prettier', label: 'Prettier', disabled: true },
    { value: 'gh-action', label: 'GitHub Action' },
  ],
  required: false,
});

console.log(additionalTools);