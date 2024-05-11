import React from 'react';
import { Trans } from 'react-i18next';

const inputLabel = ({ label, touched, error, customFeedbackLabel, withFeedbackLabel }) => {
  if (touched && error) {
    return <div className="invalid-feedback">{error}</div>;
  }

  if (touched && !error && label) {
    return withFeedbackLabel ? (
      <div className="valid-feedback">
        <Trans i18nKey="enter_valid" values={{ label }} />
      </div>
    ) : (
      ''
    );
  }

  return withFeedbackLabel ? (
    <div className="feedback">
      {customFeedbackLabel && <>{customFeedbackLabel}</>}
      {!customFeedbackLabel && <Trans i18nKey="please_enter" values={{ label: label?.toLowerCase() }} components={{ b: <b /> }} />}
    </div>
  ) : (
    ''
  );
};

const selectLabel = ({ label, touched, error, customFeedbackLabel, withFeedbackLabel }) => {
  if (touched && error) {
    return <div className="invalid-feedback">{error}</div>;
  }

  return withFeedbackLabel ? (
    <div className="feedback">
      {customFeedbackLabel && <>{customFeedbackLabel}</>}
      {!customFeedbackLabel && label && <Trans i18nKey="please_select" values={{ label: label?.toLowerCase() }} components={{ b: <b /> }} />}
    </div>
  ) : (
    ''
  );
};

export function FieldFeedbackLabel({ label, touched, error, type, customFeedbackLabel, withFeedbackLabel }) {
  switch (type) {
    case 'text':
      return inputLabel({ label, touched, error, customFeedbackLabel, withFeedbackLabel });
    case 'number':
      return inputLabel({ label, touched, error, customFeedbackLabel, withFeedbackLabel });
    case 'email':
      return inputLabel({ label, touched, error, customFeedbackLabel, withFeedbackLabel });
    case 'password':
      return inputLabel({ label, touched, error, customFeedbackLabel, withFeedbackLabel });
    default:
      return selectLabel({ label, touched, error, customFeedbackLabel, withFeedbackLabel });
  }
}
