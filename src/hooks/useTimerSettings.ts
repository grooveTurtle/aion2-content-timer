import { useState, useEffect } from 'react';
import { TimerSettings } from '@/types';
import { DEFAULT_TIMER_SETTINGS, STORAGE_KEY } from '@/constants';

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_TIMER_SETTINGS;
      }
    }
    return DEFAULT_TIMER_SETTINGS;
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
