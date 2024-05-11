import React from 'react';
import styled from 'styled-components';
import PropTypes from 'prop-types';
import { Select } from 'antd/es';
import { useField } from 'formik';
import { FieldFeedbackLabel } from './FieldFeedbackLabel';
import { useTranslation } from 'react-i18next';
const { Option } = Select;

const WrapUI = styled.div`
  width: 100%;

  .ant-select-selector {
    display: flex;
    align-items: center;
    width: 100%;
    min-height: calc(1.5em + 1.3rem + 2px);
    font-size: 1rem;
    font-weight: 400;
    color: #3f4254;
    background-color: #fff;
    border: 1px solid #e4e6ef !important;
    border-radius: 0.42rem !important;
    box-shadow: none;
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .is-valid {
    .ant-select-selector {
      border-color: #1bc5bd;
    }
  }
  .is-invalid {
    .ant-select-selector {
      border-color: #f64e60;
    }
  }
`;

const getFieldCSSClasses = (touched, errors) => {
  const classes = [];
  if (touched && errors) {
    classes.push('is-invalid');
  }

  if (touched && !errors) {
    classes.push('is-valid');
  }

  return classes.join(' ');
};

function MultiSelect({ withFeedbackLabel = true, customFeedbackLabel, children, onChange, label, ...props }) {
  const { t } = useTranslation();
  const [field, meta] = useField(props);
  const { touched, error } = meta;
  return (
    <WrapUI>
      {label && <label>{label}</label>}
      <Select
        className={getFieldCSSClasses(touched, error)}
        mode="multiple"
        allowClear
        style={{ width: '100%' }}
        placeholder={t('multi_select_placeholder')}
        {...field}
        {...props}
        onChange={onChange}>
        {children.map((child, i) => (
          <Option key={child.value}>{child.label}</Option>
        ))}
      </Select>
      <FieldFeedbackLabel
        erros={error}
        touched={touched}
        label={label}
        customFeedbackLabel={customFeedbackLabel}
        withFeedbackLabel={withFeedbackLabel}
      />
    </WrapUI>
  );
}

MultiSelect.propTypes = {
  children: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired
};

export default MultiSelect;
