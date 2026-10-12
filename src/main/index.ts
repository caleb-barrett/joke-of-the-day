import { app } from 'electron';

import { registerIpcHandlers } from '@/main/ipc';
import { isLaunchedAtStartup, registerStartup } from '@/main/startup.service';
import { createPopupWindow } from '@/main/window.service';
import { POPUP_DELAY_MS } from '@/shared/constants';

if (!app.requestSingleInstanceLock()) {
  app.quit();
} else {
  app.whenReady().then(() => {
    registerStartup();
    registerIpcHandlers();
    const delayMs = isLaunchedAtStartup(process.argv) ? POPUP_DELAY_MS : 0;
    setTimeout(createPopupWindow, delayMs);
  });

  app.on('window-all-closed', () => app.quit());
}
