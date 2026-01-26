import React, { useState } from 'react';
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
  const [showCustomAdvance, setShowCustomAdvance] = useState(false);
  const [customAdvanceNotice, setCustomAdvanceNotice] = useState('');

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
          enabled: !isCurrentlyEnabled,
          // 활성화 시 모든 옵션 선택, 비활성화 시 옵션 유지
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

  const toggleAdvanceNotice = (advance: number) => {
    if (settings.advanceNotices.includes(advance)) {
      onUpdate({ advanceNotices: settings.advanceNotices.filter((a) => a !== advance) });
    } else {
      onUpdate({ advanceNotices: [...settings.advanceNotices, advance].sort((a, b) => a - b) });
    }
  };

  const addCustomAdvanceNotice = () => {
    const notice = Number(customAdvanceNotice);
    if (!isNaN(notice) && notice > 0 && notice < 60 && !settings.advanceNotices.includes(notice)) {
      onUpdate({ advanceNotices: [...settings.advanceNotices, notice].sort((a, b) => a - b) });
      setCustomAdvanceNotice('');
      setShowCustomAdvance(false);
    }
  };

  const removeCustomAdvanceNotice = (advance: number) => {
    if (!QUICK_ADVANCE_NOTICES.includes(advance)) {
      onUpdate({ advanceNotices: settings.advanceNotices.filter((a) => a !== advance) });
    }
  };

  // 활성화된 컨텐츠가 하나도 없는지 확인
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
          <p className="section-description">알림을 받을 컨텐츠를 선택하세요 (복수 선택 가능)</p>
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

                    {/* 슈고 페스타 전용: 경기 시작 직전 알림 */}
                    {content.id === 'shugo' && (
                      <button
                        className={`game-start-notice-btn ${settings.gameStartNotice ? 'active' : ''}`}
                        onClick={() => onUpdate({ gameStartNotice: !settings.gameStartNotice })}
                      >
                        <span className="notice-icon">{settings.gameStartNotice ? '🔔' : '🔕'}</span>
                        <span className="notice-text">경기 시작 10초 전 알림</span>
                        <span className={`notice-status ${settings.gameStartNotice ? 'on' : 'off'}`}>
                          {settings.gameStartNotice ? 'ON' : 'OFF'}
                        </span>
                      </button>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h3>사전 알림</h3>
          <p className="section-description">알람 시작 전에 별도의 사전 알림을 받고 싶을때</p>
        </div>

        <div className="quick-select-grid">
          {QUICK_ADVANCE_NOTICES.map((advance) => (
            <button
              key={advance}
              className={`quick-select-btn ${settings.advanceNotices.includes(advance) ? 'active' : ''}`}
              onClick={() => toggleAdvanceNotice(advance)}
            >
              {advance}분 전
            </button>
          ))}
        </div>

        {settings.advanceNotices.filter(a => !QUICK_ADVANCE_NOTICES.includes(a)).length > 0 && (
          <div className="custom-items">
            <span className="custom-label">커스텀:</span>
            {settings.advanceNotices
              .filter(a => !QUICK_ADVANCE_NOTICES.includes(a))
              .map((advance) => (
                <div key={advance} className="custom-chip">
                  <span>{advance}분 전</span>
                  <button onClick={() => removeCustomAdvanceNotice(advance)}>×</button>
                </div>
              ))}
          </div>
        )}

        {!showCustomAdvance ? (
          <button className="add-custom-btn" onClick={() => setShowCustomAdvance(true)}>
            + 다른 시간 추가
          </button>
        ) : (
          <div className="custom-input-row">
            <input
              type="number"
              min="1"
              max="59"
              value={customAdvanceNotice}
              onChange={(e) => setCustomAdvanceNotice(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') addCustomAdvanceNotice();
                if (e.key === 'Escape') setShowCustomAdvance(false);
              }}
              placeholder="분 (1-59)"
              autoFocus
            />
            <button onClick={addCustomAdvanceNotice} className="confirm-btn">추가</button>
            <button onClick={() => setShowCustomAdvance(false)} className="cancel-btn">취소</button>
          </div>
        )}
      </div>

      <div className="setting-section">
        <div className="section-header">
          <h3>알람 지속 시간</h3>
          <p className="section-description">확인하지 않은 알람이 자동으로 꺼지는 시간</p>
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
