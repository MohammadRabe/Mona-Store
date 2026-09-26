// Demo adapter: replace this implementation with fetch('/api/products') when a backend is available.
import { demoProducts } from '../data/demoProducts';

const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const productsApi = {
  async list({ signal } = {}) {
    await wait(180);
    if (signal?.aborted) throw new DOMException('Request aborted', 'AbortError');
    return demoProducts;
  },
};
