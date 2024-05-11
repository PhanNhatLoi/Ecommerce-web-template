import { useField } from 'formik';
import React from 'react';
import { FieldFeedbackLabel } from './FieldFeedbackLabel';

const getFieldCSSClasses = (touched, errors) => {
  const classes = ['form-control'];
  if (touched && errors) {
    classes.push('is-invalid-select');
  }

  if (touched && !errors) {
    classes.push('is-valid-select');
  }

  return classes.join(' ');
};

export function Select({ label, withFeedbackLabel = true, customFeedbackLabel, children, ...props }) {
  const [field, meta] = useField(props);
  const { touched, error } = meta;
  return (
    <>
      {label && (
        <label>
          {label}
          {/*  <Trans i18nKey="select_label" values={{ label: label }} />*/}
        </label>
      )}
      <select className={getFieldCSSClasses(touched, error)} {...field} {...props}>
        {children}
      </select>
      <FieldFeedbackLabel
        erros={error}
        touched={touched}
        label={label}
        customFeedbackLabel={customFeedbackLabel}
        withFeedbackLabel={withFeedbackLabel}
      />
    </>
  );
}
