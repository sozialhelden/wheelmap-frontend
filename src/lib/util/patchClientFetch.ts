declare global {
  interface Window {
    fetchInflight?: number;
  }
}

export const patchFetcher = () => {
  if (globalThis?.window?.fetch !== undefined) {
    let inflight = 0;
    const fn = window.fetch;
    const replacementFunc: typeof window.fetch = async (...args) => {
      inflight = inflight + 1;
      window.fetchInflight = inflight;
      try {
        const result = await fn(...args);
        inflight = inflight - 1;
        window.fetchInflight = inflight;
        return result;
      } catch (e) {
        inflight = inflight - 1;
        window.fetchInflight = inflight;
        throw e;
      }
    };
    if (window.fetch !== replacementFunc) {
      window.fetch = replacementFunc;
    }
  }
};
