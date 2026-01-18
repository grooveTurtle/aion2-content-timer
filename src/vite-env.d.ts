/// <reference types="vite/client" />

declare module '*.css' {
  const content: string;
  export default content;
}

// Electron API 타입 정의
interface ElectronAPI {
  setTimerEnabled: (enabled: boolean) => void;
  onToggleTimer: (callback: () => void) => void;
}

interface Window {
  electronAPI?: ElectronAPI;
}
