import { join } from 'node:path';
import { BrowserWindow } from 'electron';

import { POPUP_HEIGHT, POPUP_WIDTH } from '@/shared/constants';

export function createPopupWindow(): BrowserWindow {
  const popup = new BrowserWindow({
    width: POPUP_WIDTH,
    height: POPUP_HEIGHT,
    resizable: false,
    alwaysOnTop: true,
    center: true,
    show: false,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  popup.once('ready-to-show', () => popup.show());

  const devServerUrl = process.env['ELECTRON_RENDERER_URL'];
  if (devServerUrl) {
    void popup.loadURL(devServerUrl);
  } else {
    void popup.loadFile(join(__dirname, '../renderer/index.html'));
  }

  return popup;
}
