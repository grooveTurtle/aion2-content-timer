// Alarm 관련 타입 정의

export interface AlarmState {
  isOpen: boolean;
  title: string;
  message: string;
}

export interface AlarmModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  soundType: string;
  onDismiss: () => void;
}
