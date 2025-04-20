// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import { Subject } from "./context/AppContext";

contextBridge.exposeInMainWorld("electronAPI", {
    saveApplicationState: (state:
        {
            subjects: Subject[],
            totalProgress: number,
            deadline: string
        }
    ) => ipcRenderer.send('save-application-state', state),
    getApplicationState: () => ipcRenderer.invoke('get-application-state'),
})