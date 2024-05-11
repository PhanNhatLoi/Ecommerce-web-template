import React from 'react';
import { FieldFeedbackLabel } from './FieldFeedbackLabel';
import { getFieldCSSClasses } from './utils';

export function Input({
  field, // { name, value, onChange, onBlur }
  form: { touched, errors }, // also values, setXXXX, handleXXXX, dirty, isValid, status, etc.
  label,
  withFeedbackLabel = true,
  customFeedbackLabel,
  type = 'text',
  ...props
}) {
  return (
    <>
      {label && (
        <label>
          {label}
          {/*  <Trans i18nKey="enter_label" values={{ label: label?.toLowerCase() }} />*/}
        </label>
      )}
      <input type={type} className={getFieldCSSClasses(touched[field.name], errors[field.name])} {...field} {...props} />
      <FieldFeedbackLabel
        error={errors[field.name]}
        touched={touched[field.name]}
        label={label}
        type={type}
        customFeedbackLabel={customFeedbackLabel}
        withFeedbackLabel={withFeedbackLabel}
      />
    </>
  );
}
