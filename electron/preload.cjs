const { contextBridge, ipcRenderer } = require('electron');

// Electron API를 웹 페이지에 안전하게 노출
contextBridge.exposeInMainWorld('electronAPI', {
  // 타이머 활성화 상태 전송
  setTimerEnabled: (enabled) => ipcRenderer.send('set-timer-enabled', enabled),

  // 메인 프로세스로부터 타이머 토글 이벤트 수신
  onToggleTimer: (callback) => {
    ipcRenderer.on('toggle-timer', () => callback());
  },
});
