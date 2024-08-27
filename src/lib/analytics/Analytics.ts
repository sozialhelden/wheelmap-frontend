const lastPath: string = '/';
let lastModalName: string = '';

export function trackPageView(path: string) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }

  // Matomo
  if (typeof window._paq !== 'undefined') {
    window._paq.push(['setDocumentTitle', window.document.title]);
    window._paq.push(['trackPageView']);
  }
}

export function trackModalView(name: string | null) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }
  // Matomo
  if (typeof window._paq !== 'undefined') {
    window._paq.push([
      'trackEvent',
      name ? 'ModalOpen' : 'ModalClose',
      name ? String(name) : String(lastModalName),
    ]);
  }
  lastModalName = name || '';
}

export function trackEvent(options: {
  category: string,
  action: string,
  label?: string,
  value?: number,
  nonInteraction?: boolean,
}) {
  if (typeof window === 'undefined') {
    // Don't track anything when running on server
    return;
  }

  // Matomo
  if (typeof window._paq !== 'undefined') {
    window._paq.push([
      'trackEvent',
      options.category,
      options.action,
      options.label,
      options.value,
    ]);
  }
}
