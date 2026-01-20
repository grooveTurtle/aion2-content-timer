// Timer 관련 타입 정의

export interface TimerSettings {
  alarmMinutes: number[];
  advanceNotices: number[];
  alarmSound: string;
  enabled: boolean;
}

export interface TimerSettingsProps {
  settings: TimerSettings;
  onUpdate: (settings: Partial<TimerSettings>) => void;
}

export interface AlarmSchedulerProps {
  settings: TimerSettings;
  onAlarm: (message: string, isAdvance: boolean) => void;
}
