import { useField, useFormikContext } from 'formik';
import React from 'react';
import DatePicker from 'react-datepicker/dist/es';
import { Trans } from 'react-i18next';

const getFieldCSSClasses = (touched, errors) => {
  const classes = ['form-control'];
  if (touched && errors) {
    classes.push('is-invalid');
  }

  if (touched && !errors) {
    classes.push('is-valid');
  }

  return classes.join(' ');
};

export function DatePickerField({ label, ...props }) {
  const { setFieldValue, errors, touched } = useFormikContext();
  const [field] = useField(props);

  return (
    <>
      {props.label && <label>{props.label}</label>}
      <DatePicker
        className={getFieldCSSClasses(touched[field.name], errors[field.name])}
        style={{ width: '100%' }}
        {...field}
        {...props}
        selected={(field.value && new Date(field.value)) || null}
        onChange={(val) => {
          setFieldValue(field.name, val);
        }}
      />
      {errors[field.name] && touched[field.name] ? (
        <div className="invalid-datepicker-feedback">{errors[field.name].toString()}</div>
      ) : (
        <div className="feedback">
          <Trans
            i18nKey="note_date_picker"
            components={{
              b: <b />
            }}
            values={{ label: label?.toLowerCase() }}
          />
        </div>
      )}
    </>
  );
}
