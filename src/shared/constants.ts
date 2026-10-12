/** Delay between a login-triggered launch and the popup appearing. */
export const POPUP_DELAY_MS = 10_000;

/** CLI arg the HKCU Run key passes so the app knows it was launched at sign-in. */
export const STARTUP_ARG = '--startup';

export const POPUP_WIDTH = 420;
export const POPUP_HEIGHT = 260;

export const IPC_CHANNELS = {
  GET_JOKE: 'joke:get',
  CLOSE_POPUP: 'popup:close',
} as const;
