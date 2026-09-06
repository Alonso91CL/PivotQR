export {};

declare global {
  interface Window {
    __pivotqrTurnstileToken?: string | null;
    pivotqrOnTurnstile?: (token: string) => void;
  }
}