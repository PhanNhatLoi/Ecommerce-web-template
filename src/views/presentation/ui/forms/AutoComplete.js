import { AutoComplete } from 'antd/es';
import React from 'react';
import styled from 'styled-components';

const WrapUI = styled.div`
  .ant-select {
    width: 100%;
  }

  .ant-select-selector {
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

    .ant-select-selection-search-input {
      height: 100% !important;
    }
    .ant-select-selection-placeholder {
      line-height: calc(1.5em + 1.3rem + 2px) !important;
    }
  }
`;
function AutoCompleteField({ value, placeholder, options = [], onKeyDown, onSelect, onChange }) {
  return (
    <WrapUI>
      <AutoComplete
        value={value}
        options={options}
        onSelect={onSelect}
        onChange={onChange}
        placeholder={placeholder}
        onKeyDown={(e) => {
          if (e.keyCode === 13) {
            onKeyDown && onKeyDown(e.target.value);
          }
        }}
        filterOption={(inputValue, option) => {
          return option?.value?.toLowerCase().indexOf(inputValue?.toLowerCase()) !== -1;
        }}
      />
    </WrapUI>
  );
}

export default AutoCompleteField;
