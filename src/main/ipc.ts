import { BrowserWindow, ipcMain } from 'electron';

import { getJoke } from '@/main/joke.service';
import { IPC_CHANNELS } from '@/shared/constants';

export function registerIpcHandlers(): void {
  ipcMain.handle(IPC_CHANNELS.GET_JOKE, () => getJoke());
  ipcMain.on(IPC_CHANNELS.CLOSE_POPUP, (event) => {
    BrowserWindow.fromWebContents(event.sender)?.close();
  });
}
