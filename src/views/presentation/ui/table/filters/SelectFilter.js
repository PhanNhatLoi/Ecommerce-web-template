import { Form, Select } from 'antd/es';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import useFirstRender from '~/views/hooks/UseFirstRender';

const WrapSelect = styled(Form.Item)`
  .ant-select-selector {
    border: none !important;
    background-color: rgba(24, 125, 228, 0.12) !important;
    border-radius: 4px !important;
    text-transform: unset;
    height: 34px !important;
    text-transform: none;
    text-align: left;
    color: rgba(0, 0, 0, 0.85);
    font-size: 14px;
    font-weight: 400;
    letter-spacing: 0;
    box-shadow: none !important;
    outline: none !important;

    .ant-select-selection-search-input {
      height: 34px !important;
    }
    .ant-select-selection-item,
    .ant-select-selection-placeholder {
      line-height: 34px;
    }
  }
  .ant-select-clear {
    background: #e3effc;
    svg {
      width: 15px;
      height: 15px;
    }
  }
`;

function SelectFilter({ onFilter, isClearFilters, placeholder, options }) {
  const [value, setValue] = useState();

  const isFirstRender = useFirstRender();

  useEffect(() => {
    if (!isFirstRender && onFilter) {
      !isClearFilters && onFilter(value);
      isClearFilters && onFilter('clear_filters_ignore_fetch');
    }
  }, [value]);

  useEffect(() => {
    !isFirstRender && isClearFilters && setValue();
  }, [isClearFilters]);

  return (
    <WrapSelect hasFeedback={false} onClick={(e) => e.stopPropagation()} className="m-0 p-0">
      <Select
        allowClear
        onClick={(e) => e.stopPropagation()}
        onChange={(val) => setValue(val)}
        value={value}
        placeholder={placeholder}
        className="w-100"
        style={{ minWidth: 132 }}
        //search
        showSearch
        filterOption={(input, option) => {
          return option.children?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0;
        }}>
        {(options || []).map((o, i) => {
          return (
            <Select.Option key={i} value={o.value}>
              {o.label}
            </Select.Option>
          );
        })}
      </Select>
    </WrapSelect>
  );
}
export default SelectFilter;
