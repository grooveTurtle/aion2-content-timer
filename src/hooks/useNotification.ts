import { useEffect, useState, useCallback } from 'react';
import { soundGenerator } from '../utils/soundGenerator';

export const useNotification = () => {
  const [permission, setPermission] = useState<NotificationPermission>('default');

  useEffect(() => {
    if ('Notification' in window) {
      setPermission(Notification.permission);
    }
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result;
    }
    return 'denied';
  }, []);

  const showNotification = useCallback((title: string, body: string, soundType?: string, volume?: number) => {
    if (permission === 'granted') {
      const notification = new Notification(title, {
        body,
        icon: '/vite.svg',
        badge: '/vite.svg',
        tag: 'shugo-timer',
        requireInteraction: false,
      });

      if (soundType) {
        soundGenerator.play(soundType, volume ?? 0.5);
      }

      notification.onclick = () => {
        window.focus();
        notification.close();
      };

      setTimeout(() => notification.close(), 10000);
    }
  }, [permission]);

  return { permission, requestPermission, showNotification };
};
