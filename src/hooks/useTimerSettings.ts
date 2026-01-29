import { useState, useEffect } from 'react';
import { TimerSettings, ContentType } from '@/types';
import { DEFAULT_TIMER_SETTINGS, STORAGE_KEY } from '@/constants';

// 기존 설정을 새 형식으로 마이그레이션
const migrateSettings = (saved: any): TimerSettings => {
  // 기본 설정으로 시작
  const migrated: TimerSettings = {
    ...DEFAULT_TIMER_SETTINGS,
    alarmSound: saved.alarmSound || DEFAULT_TIMER_SETTINGS.alarmSound,
    alarmDuration: saved.alarmDuration ?? DEFAULT_TIMER_SETTINGS.alarmDuration,
    enabled: saved.enabled ?? DEFAULT_TIMER_SETTINGS.enabled,
  };

  // 글로벌 advanceNotices가 있으면 각 컨텐츠에 적용 (이전 버전 호환)
  const globalAdvanceNotices = saved.advanceNotices || [];

  // contentSettings 마이그레이션
  if (saved.contentSettings) {
    (Object.keys(saved.contentSettings) as ContentType[]).forEach(key => {
      if (migrated.contentSettings[key]) {
        const savedContent = saved.contentSettings[key];
        migrated.contentSettings[key] = {
          enabled: savedContent?.enabled ?? false,
          options: savedContent?.options || [],
          // 컨텐츠별 advanceNotices가 있으면 사용, 없으면 글로벌 설정 또는 기본값 사용
          advanceNotices: savedContent?.advanceNotices
            || (globalAdvanceNotices.length > 0 ? globalAdvanceNotices : DEFAULT_TIMER_SETTINGS.contentSettings[key].advanceNotices),
        };
      }
    });
  }

  // 기존 alarmMinutes가 있으면 슈고 페스타 옵션으로 변환
  if (saved.alarmMinutes && Array.isArray(saved.alarmMinutes)) {
    const shugoOptions = saved.alarmMinutes.filter((m: number) => m === 15 || m === 45);
    if (shugoOptions.length > 0) {
      migrated.contentSettings.shugo.enabled = true;
      migrated.contentSettings.shugo.options = shugoOptions;
    }
  }

  return migrated;
};

export const useTimerSettings = () => {
  const [settings, setSettings] = useState<TimerSettings>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return migrateSettings(parsed);
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
