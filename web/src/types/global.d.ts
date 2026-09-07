export {};

declare global {
  interface Window {
    __pivotqrTurnstileToken?: string | null;
    turnstile?: {
      render: (
        element: HTMLElement | string,
        options: Record<string, unknown>,
      ) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}