import { useState, useEffect } from 'react';

export interface TimerSettings {
  alarmMinutes: number[];
  advanceNotices: number[];
  alarmSound: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: TimerSettings = {
  alarmMinutes: [15, 45],
  advanceNotices: [3, 5],
  alarmSound: 'urgent',
  enabled: true,
};

const STORAGE_KEY = 'shugo-timer-settings';

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_SETTINGS;
      }
    }
    return DEFAULT_SETTINGS;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));

    // Electron에 타이머 활성화 상태 전송
    if (window.electronAPI) {
      window.electronAPI.setTimerEnabled(settings.enabled);
    }
  }, [settings]);

  const updateSettings = (newSettings: Partial<TimerSettings>) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  return { settings, updateSettings };
};
