import { useEffect, useRef } from 'react';
import { AlarmSchedulerProps, ContentType } from '@/types';
import { CONTENT_LIST } from '@/constants';

export const useAlarmScheduler = ({ settings, onAlarm }: AlarmSchedulerProps) => {
  const intervalRef = useRef<number | null>(null);
  const notifiedAlarmsRef = useRef<Set<string>>(new Set());
  const onAlarmRef = useRef(onAlarm);

  // 콜백이 변경될 때마다 ref 업데이트 (interval 재시작 없이)
  useEffect(() => {
    onAlarmRef.current = onAlarm;
  }, [onAlarm]);

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
      const currentSecond = now.getSeconds();

      // 모든 활성화된 컨텐츠를 순회
      (Object.keys(settings.contentSettings) as ContentType[]).forEach(contentId => {
        const contentConfig = settings.contentSettings[contentId];
        const contentInfo = CONTENT_LIST.find(c => c.id === contentId);

        // 비활성화되었거나 옵션이 선택되지 않은 컨텐츠는 스킵
        if (!contentConfig.enabled || contentConfig.options.length === 0 || !contentInfo) {
          return;
        }

        // 컨텐츠별 알람 시간 계산
        const alarmTimes = contentInfo.getAlarmTimes(contentConfig.options);

        alarmTimes.forEach(({ hour: alarmHour, minute: alarmMinute }) => {
          // 슈고 페스타: 매 시간 해당 분에 알람 (hour는 무시)
          // 시공의 균열: 특정 시간에만 알람 (hour 체크)
          const isTimeMatch = contentId === 'shugo'
            ? currentMinute === alarmMinute
            : currentHour === alarmHour && currentMinute === alarmMinute;

          // 메인 알람 체크 (해당 분의 처음 5초 이내에 체크)
          if (isTimeMatch && currentSecond < 5) {
            const alarmKey = `${currentHour}:${alarmMinute}:${contentId}:main`;
            if (!notifiedAlarmsRef.current.has(alarmKey)) {
              notifiedAlarmsRef.current.add(alarmKey);

              const message = contentId === 'shugo'
                ? `${currentHour}시 ${alarmMinute}분 슈고 페스타 경기 시작!`
                : `${currentHour}시 시공의 균열이 열렸습니다!`;

              onAlarmRef.current(message, false);

              setTimeout(() => {
                notifiedAlarmsRef.current.delete(alarmKey);
              }, 60000);
            }
          }

          // 사전 알림 체크 (컨텐츠별 설정 사용)
          contentConfig.advanceNotices.forEach((advance) => {
            let advanceHour = alarmHour;
            let advanceMinute = alarmMinute - advance;

            // 분이 음수인 경우 시간 조정
            if (advanceMinute < 0) {
              advanceMinute += 60;
              advanceHour = (advanceHour - 1 + 24) % 24;
            }

            const isAdvanceTimeMatch = contentId === 'shugo'
              ? currentMinute === advanceMinute
              : currentHour === advanceHour && currentMinute === advanceMinute;

            // 사전 알림도 해당 분의 처음 5초 이내에 체크
            if (isAdvanceTimeMatch && currentSecond < 5) {
              const advanceKey = `${currentHour}:${advanceMinute}:${contentId}:advance${advance}`;
              if (!notifiedAlarmsRef.current.has(advanceKey)) {
                notifiedAlarmsRef.current.add(advanceKey);

                const contentName = contentInfo.name;
                onAlarmRef.current(`${advance}분 후 ${contentName} 예정`, true);

                setTimeout(() => {
                  notifiedAlarmsRef.current.delete(advanceKey);
                }, 60000);
              }
            }
          });
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
  }, [settings]);
};
