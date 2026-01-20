import { Shortcuts } from '@/types';

export const DEFAULT_SHORTCUTS: Shortcuts = {
  stopAlarmSound: 'CommandOrControl+Shift+Z',
  toggleTimer: 'CommandOrControl+Shift+W',
  showWindow: 'CommandOrControl+Shift+Q',
};

export const SHORTCUT_LABELS: Record<keyof Shortcuts, string> = {
  stopAlarmSound: '알람 사운드 중지',
  toggleTimer: '타이머 토글',
  showWindow: '창 표시/숨기기',
};

export const SHORTCUT_DESCRIPTIONS: Record<keyof Shortcuts, string> = {
  stopAlarmSound: '알람 사운드를 즉시 중지합니다',
  toggleTimer: '타이머를 활성화/비활성화합니다',
  showWindow: '앱 창을 표시하거나 숨깁니다',
};
