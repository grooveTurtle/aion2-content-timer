import { TimerSettings, ContentInfo, ContentType } from '@/types';

// 컨텐츠 정보 정의
export const CONTENT_LIST: ContentInfo[] = [
  {
    id: 'shugo',
    name: '슈고 페스타',
    description: '매 시간 18분, 48분에 경기 시작 (입장은 3분 전)',
    getAlarmTimes: (options: number[]) => {
      // options: 선택된 세션 (18분, 45분대)
      // 경기 시작 시간은 입장 시간 + 3분 (15→18, 45→48)
      const times: { hour: number; minute: number }[] = [];
      for (let hour = 0; hour < 24; hour++) {
        options.forEach(entryMinute => {
          const gameStartMinute = entryMinute + 3; // 경기 시작은 입장 3분 후
          times.push({ hour, minute: gameStartMinute });
        });
      }
      return times;
    },
  },
  {
    id: 'sigong',
    name: '시공의 균열',
    description: '오전 2시 기준 3시간 간격',
    getAlarmTimes: (options: number[]) => {
      // 시공: 2시, 5시, 8시, 11시, 14시, 17시, 20시, 23시
      // options: 선택된 시간대들
      return options.map(hour => ({ hour, minute: 0 }));
    },
  },
];

// 컨텐츠별 옵션 정의
export const CONTENT_OPTIONS: Record<ContentType, { value: number; label: string }[]> = {
  shugo: [
    { value: 15, label: '18분' },
    { value: 45, label: '48분' },
  ],
  sigong: [
    { value: 2, label: '02시' },
    { value: 5, label: '05시' },
    { value: 8, label: '08시' },
    { value: 11, label: '11시' },
    { value: 14, label: '14시' },
    { value: 17, label: '17시' },
    { value: 20, label: '20시' },
    { value: 23, label: '23시' },
  ],
};

// 기본 타이머 설정 (다중 컨텐츠 선택 가능)
export const DEFAULT_TIMER_SETTINGS: TimerSettings = {
  contentSettings: {
    shugo: {
      enabled: false,
      options: [],
      advanceNotices: [3], // 슈고: 3분 전 = 입장 시간
    },
    sigong: {
      enabled: false,
      options: [],
      advanceNotices: [5], // 시공: 5분 전
    },
  },
  alarmSound: 'urgent',
  alarmDuration: 60,
  enabled: true,
};

// 로컬 스토리지 키
export const STORAGE_KEY = 'aion2-content-timer-settings';

// 빠른 선택 옵션
export const QUICK_ADVANCE_NOTICES = [1, 3, 5, 10];

// 알람 사운드 옵션
export interface AlarmSoundOption {
  value: string;
  label: string;
  icon: string;
}

export const ALARM_SOUNDS: AlarmSoundOption[] = [
  { value: 'urgent', label: '긴급 알람', icon: '🚨' },
  { value: 'cheerful', label: '명랑한 비프', icon: '🎵' },
  { value: 'classic', label: '클래식 벨', icon: '⏰' },
  { value: 'gentle', label: '부드러운 종', icon: '🔔' },
];

// 알람 지속 시간 옵션 (초 단위)
export interface AlarmDurationOption {
  value: number;
  label: string;
}

export const ALARM_DURATIONS: AlarmDurationOption[] = [
  { value: 10, label: '10초' },
  { value: 30, label: '30초' },
  { value: 60, label: '1분' },
  { value: 180, label: '3분' },
];
