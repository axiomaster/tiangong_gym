import defaults from './defaults.json';

export const VMALL_CONFIG = {
  categories: defaults.categories,
  products: defaults.products,
} as const;

export default VMALL_CONFIG;
