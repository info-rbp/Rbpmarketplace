export function trackEvent(eventName: string, payload?: Record<string, unknown>) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent('analytics:event', {
        detail: { eventName, payload },
      }),
    );
  }

  if (import.meta.env.DEV) {
    console.info('[analytics]', eventName, payload ?? {});
  }
}