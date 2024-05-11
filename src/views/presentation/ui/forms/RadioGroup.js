import React from 'react';
import styled from 'styled-components';

const UIRadio = styled.div`
  .form-check-label {
    display: flex;
    align-items: center;
    white-space: nowrap;
  }
  input.form-check-input {
    width: 18px;
    height: 18px;
    position: relative;
    margin-right: 3px;
  }
`;

function RadioGroup({ name, data = [], value, onChange }) {
  const handleChange = (e) => {
    onChange && onChange(e.target.value);
  };

  return (
    <UIRadio className="d-flex align-items-center flex-wrap">
      {data.map((op, i) => {
        return (
          <div className="form-check mr-5" key={i}>
            <label className="form-check-label ">
              <input
                className="form-check-input"
                type="radio"
                name={name}
                value={op.value}
                onChange={handleChange}
                checked={op.value === value}
              />
              {op.label}
            </label>
          </div>
        );
      })}
    </UIRadio>
  );
}

export default RadioGroup;
