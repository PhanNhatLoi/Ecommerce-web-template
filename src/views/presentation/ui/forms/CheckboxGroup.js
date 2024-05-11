import React from 'react';
import PropTypes from 'prop-types';
import { useField, useFormikContext } from 'formik';

export function CheckboxGroup({ label, data, value, onChange, type, ...props }) {
  const { errors, touched } = useFormikContext();
  const [field] = useField(props);

  const handleChecked = (e) => {
    const { checked, value: val } = e.target;

    if (type === 'single') {
      onChange(val);
    } else {
      checked ? onChange([...value, val]) : onChange(value.filter((i) => i != val));
    }
  };

  const check = (val) => {
    if (type === 'single') {
      return value == val ? true : false;
    } else {
      // multiple
      for (let item of value) {
        if (item == val) {
          return true;
        }
      }
      return false;
    }
  };

  return (
    <React.Fragment>
      {label && <label>{label}</label>}
      <div {...props}>
        {data.map((item, i) => {
          return (
            <label key={i} className="checkbox checkbox-lg checkbox-single d-inline-flex mr-4">
              <input type="checkbox" value={item.value} checked={check(item.value)} onChange={handleChecked} />
              <span className="mr-2" /> {item.label}
            </label>
          );
        })}
      </div>
      {errors?.[field.name] && touched?.[field.name] && <div className="invalid-feedback d-block">{errors[field.name].toString()}</div>}
    </React.Fragment>
  );
}
CheckboxGroup.defaultProps = {
  type: 'multiple',
  label: ''
};

CheckboxGroup.propTypes = {
  data: PropTypes.array.isRequired,
  onChange: PropTypes.func.isRequired,
  value: PropTypes.any.isRequired,
  type: PropTypes.string,
  label: PropTypes.string
};
