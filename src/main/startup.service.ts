import { app } from 'electron';

import { STARTUP_ARG } from '@/shared/constants';

export function isLaunchedAtStartup(argv: string[]): boolean {
  return argv.includes(STARTUP_ARG);
}

/**
 * Registers the app in HKCU\Software\Microsoft\Windows\CurrentVersion\Run so it
 * launches with `--startup` at every sign-in. Skipped in dev so `electron.exe`
 * is never registered.
 */
export function registerStartup(): void {
  if (!app.isPackaged) {
    return;
  }
  app.setLoginItemSettings({
    openAtLogin: true,
    path: process.execPath,
    args: [STARTUP_ARG],
  });
}

/** Removes the Run key entry. Hook for a future settings/uninstall item. */
export function unregisterStartup(): void {
  app.setLoginItemSettings({
    openAtLogin: false,
    path: process.execPath,
    args: [STARTUP_ARG],
  });
}
