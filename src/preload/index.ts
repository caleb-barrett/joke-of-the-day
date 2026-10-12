import { contextBridge, ipcRenderer } from 'electron';

import { IPC_CHANNELS } from '@/shared/constants';
import type { JokeApi } from '@/shared/types';

const api: JokeApi = {
  getJoke: () => ipcRenderer.invoke(IPC_CHANNELS.GET_JOKE),
  closePopup: () => ipcRenderer.send(IPC_CHANNELS.CLOSE_POPUP),
};

contextBridge.exposeInMainWorld('jokeApi', api);
