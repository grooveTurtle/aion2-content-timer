import React from 'react';
import { TimerSettingsProps, ContentType } from '@/types';
import {
  ALARM_SOUNDS,
  ALARM_DURATIONS,
  QUICK_ADVANCE_NOTICES,
  CONTENT_LIST,
  CONTENT_OPTIONS,
} from '@/constants';
import { soundGenerator } from '@/utils/soundGenerator';
import './TimerSettings.css';

const TimerSettings: React.FC<TimerSettingsProps> = ({ settings, onUpdate }) => {
  const playTestSound = (soundValue: string) => {
    soundGenerator.play(soundValue, 0.5);
  };

  const toggleContentEnabled = (contentId: ContentType) => {
    const isCurrentlyEnabled = settings.contentSettings[contentId].enabled;
    const allOptions = CONTENT_OPTIONS[contentId].map(opt => opt.value);

    onUpdate({
      contentSettings: {
        ...settings.contentSettings,
        [contentId]: {
          ...settings.contentSettings[contentId],
          enabled: !isCurrentlyEnabled,
          options: !isCurrentlyEnabled ? allOptions : settings.contentSettings[contentId].options,
        },
      },
    });
  };

  const toggleContentOption = (contentId: ContentType, optionValue: number) => {
    const currentOptions = settings.contentSettings[contentId].options;
    const newOptions = currentOptions.includes(optionValue)
      ? currentOptions.filter(v => v !== optionValue)
      : [...currentOptions, optionValue].sort((a, b) => a - b);

    onUpdate({
      contentSettings: {
        ...settings.contentSettings,
        [contentId]: {
          ...settings.contentSettings[contentId],
          options: newOptions,
        },
      },
    });
  };

  const toggleAdvanceNotice = (contentId: ContentType, advance: number) => {
    const currentNotices = settings.contentSettings[contentId].advanceNotices;
    const newNotices = currentNotices.includes(advance)
      ? currentNotices.filter(a => a !== advance)
      : [...currentNotices, advance].sort((a, b) => a - b);

    onUpdate({
      contentSettings: {
        ...settings.contentSettings,
        [contentId]: {
          ...settings.contentSettings[contentId],
          advanceNotices: newNotices,
        },
      },
    });
  };

  const noContentEnabled = !Object.values(settings.contentSettings).some(c => c.enabled);

  return (
    <div className={`timer-settings ${!settings.enabled ? 'disabled' : ''}`}>
      <div className="settings-header">
        <h2>타이머 설정</h2>
        <label className={`toggle-switch ${!settings.enabled ? 'inactive' : ''}`}>
          <input
            type="checkbox"
            checked={settings.enabled}
            onChange={(e) => onUpdate({ enabled: e.target.checked })}
          />
          <span className="toggle-slider"></span>
          <span className="toggle-label">
            {settings.enabled ? '활성화' : '비활성화'}
          </span>
        </label>
      </div>

      {!settings.enabled && (
        <div className="warning-banner">
          <span className="warning-icon">⚠️</span>
          <span className="warning-text">타이머가 비활성화되어 있습니다. 알람이 울리지 않습니다.</span>
        </div>
      )}

      <div className="setting-section">
        <div className="section-header">
          <h3>컨텐츠 선택</h3>
          <p className="section-description">알림을 받을 컨텐츠를 선택하세요</p>
        </div>

        {noContentEnabled && (
          <div className="warning-banner small">
            <span className="warning-icon">⚠️</span>
            <span className="warning-text">컨텐츠를 선택해주세요.</span>
          </div>
        )}

        <div className="content-list">
          {CONTENT_LIST.map((content) => {
            const contentConfig = settings.contentSettings[content.id];
            const options = CONTENT_OPTIONS[content.id];

            return (
              <div key={content.id} className={`content-card ${contentConfig.enabled ? 'active' : ''}`}>
                <div className="content-header">
                  <label className={`toggle-switch ${!contentConfig.enabled ? 'inactive' : ''}`}>
                    <input
                      type="checkbox"
                      checked={contentConfig.enabled}
                      onChange={() => toggleContentEnabled(content.id)}
                    />
                    <span className="toggle-slider"></span>
                  </label>
                  <div className="content-info">
                    <span className="content-name">{content.name}</span>
                    <span className="content-description">{content.description}</span>
                  </div>
                </div>

                {contentConfig.enabled && (
                  <div className="content-options">
                    <div className="options-grid">
                      {options.map((option) => (
                        <button
                          key={option.value}
                          className={`option-btn ${contentConfig.options.includes(option.value) ? 'active' : ''}`}
                          onClick={() => toggleContentOption(content.id, option.value)}
                        >
                          {option.label}
                        </button>
                      ))}
                    </div>
                    {contentConfig.options.length === 0 && (
                      <div className="warning-banner small">
                        <span className="warning-icon">⚠️</span>
                        <span className="warning-text">시간을 선택해주세요.</span>
                      </div>
                    )}

                    {/* 컨텐츠별 사전 알림 */}
                    <div className="advance-notice-section">
                      <span className="advance-notice-label">사전 알림</span>
                      <div className="advance-notice-grid">
                        {QUICK_ADVANCE_NOTICES.map((advance) => (
                          <button
                            key={advance}
                            className={`advance-btn ${contentConfig.advanceNotices.includes(advance) ? 'active' : ''}`}
                            onClick={() => toggleAdvanceNotice(content.id, advance)}
                          >
                            {advance}분 전
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h3>사전 알림 지속 시간</h3>
          <p className="section-description">확인하지 않은 사전 알림이 자동으로 꺼지는 시간</p>
        </div>

        <div className="quick-select-grid">
          {ALARM_DURATIONS.map((duration) => (
            <button
              key={duration.value}
              className={`quick-select-btn ${settings.alarmDuration === duration.value ? 'active' : ''}`}
              onClick={() => onUpdate({ alarmDuration: duration.value })}
            >
              {duration.label}
            </button>
          ))}
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h3>알람 사운드</h3>
          <p className="section-description">알람 소리를 선택하고 미리 들어보세요</p>
        </div>

        <div className="sound-selector">
          {ALARM_SOUNDS.map((sound) => (
            <button
              key={sound.value}
              className={`sound-option ${settings.alarmSound === sound.value ? 'active' : ''}`}
              onClick={() => onUpdate({ alarmSound: sound.value })}
            >
              <span className="sound-icon">{sound.icon}</span>
              <span className="sound-label">{sound.label}</span>
              <button
                className="play-btn"
                onClick={(e) => {
                  e.stopPropagation();
                  playTestSound(sound.value);
                }}
              ></button>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TimerSettings;
