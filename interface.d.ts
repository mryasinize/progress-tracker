import { Subject } from "src/context/AppContext"

export interface IElectronAPI {
    saveApplicationState: (state) => void
    getApplicationState: () => Promise<any>
}

declare global {
    interface Window {
        electronAPI: IElectronAPI
    }
}