import { useField } from 'formik';
import React from 'react';
import { FieldFeedbackLabel } from './FieldFeedbackLabel';
import { getFieldCSSClasses } from './utils';

export function Textarea({ label, withFeedbackLabel = true, customFeedbackLabel, ...props }) {
  const [field, meta] = useField(props);
  const { touched, error } = meta;
  return (
    <>
      {label && (
        <label>
          {label}
          {/*  <Trans i18nKey="enter_label" values={{ label: label }} />*/}
        </label>
      )}
      <textarea className={getFieldCSSClasses(touched, error)} {...field} {...props}></textarea>
      <FieldFeedbackLabel
        type="text"
        error={error}
        touched={touched}
        label={label}
        customFeedbackLabel={customFeedbackLabel}
        withFeedbackLabel={withFeedbackLabel}
      />
    </>
  );
}
