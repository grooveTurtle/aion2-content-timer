import { Shortcuts } from "./shortcuts-types";

declare global {
  interface ElectronAPI {
    setTimerEnabled: (enabled: boolean) => void;
    onToggleTimer: (callback: () => void) => void;
    getShortcuts: () => Promise<Shortcuts>;
    setShortcuts: (shortcuts: Shortcuts) => Promise<{ success: boolean }>;
    validateShortcut: (shortcut: string) => Promise<{ valid: boolean; error?: string }>;
  }

  interface Window {
    electronAPI?: ElectronAPI;
  }
}

export {};