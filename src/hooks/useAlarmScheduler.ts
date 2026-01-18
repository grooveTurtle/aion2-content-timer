import { useEffect, useRef } from 'react';
import { TimerSettings } from './useTimerSettings';

interface AlarmSchedulerProps {
  settings: TimerSettings;
  onAlarm: (message: string, isAdvance: boolean) => void;
}

export const useAlarmScheduler = ({ settings, onAlarm }: AlarmSchedulerProps) => {
  const intervalRef = useRef<number | null>(null);
  const notifiedAlarmsRef = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!settings.enabled) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      return;
    }

    const checkAlarms = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentTime = `${currentHour}:${currentMinute}`;

      if (notifiedAlarmsRef.current.has(currentTime)) {
        return;
      }

      settings.alarmMinutes.forEach((alarmMinute) => {
        if (currentMinute === alarmMinute) {
          notifiedAlarmsRef.current.add(currentTime);
          onAlarm(`알람: ${currentHour}시 ${alarmMinute}분`, false);

          setTimeout(() => {
            notifiedAlarmsRef.current.delete(currentTime);
          }, 60000);
        }

        settings.advanceNotices.forEach((advance) => {
          const advanceMinute = (alarmMinute - advance + 60) % 60;
          const advanceHour = alarmMinute - advance < 0 ? currentHour - 1 : currentHour;

          if (currentMinute === advanceMinute && currentHour === advanceHour) {
            const advanceKey = `${currentHour}:${currentMinute}:advance${advance}`;
            if (!notifiedAlarmsRef.current.has(advanceKey)) {
              notifiedAlarmsRef.current.add(advanceKey);
              onAlarm(`사전 알림: ${advance}분 후 알람 예정`, true);

              setTimeout(() => {
                notifiedAlarmsRef.current.delete(advanceKey);
              }, 60000);
            }
          }
        });
      });
    };

    checkAlarms();

    intervalRef.current = window.setInterval(checkAlarms, 1000);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [settings, onAlarm]);
};
