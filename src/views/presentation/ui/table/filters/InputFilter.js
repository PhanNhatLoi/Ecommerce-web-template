import React, { useCallback, useEffect, useState } from 'react';
import { Input, Form } from 'antd/es';
import { SearchOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import { debounce } from 'lodash-es';
import useFirstRender from '~/views/hooks/UseFirstRender';

const WrapInput = styled(Form.Item)`
  min-width: 120px;
  .ant-input-affix-wrapper {
    border: none;
    background-color: rgba(24, 125, 228, 0.12);
    border-radius: 4px;
    .ant-input {
      padding: 2px 4px;
      background-color: unset;
    }
    .anticon {
      color: gray;
    }
  }

  .ant-input-affix-wrapper:focus,
  .ant-input-affix-wrapper-focused {
    box-shadow: none;
  }
`;

function InputFilter({ onFilter, isClearFilters, placeholder }) {
  const [value, setValue] = useState('');

  const isFirstRender = useFirstRender();

  const handleFilter = useCallback(
    debounce((value) => onFilter(value), 500),
    [] // will be created only once initially
  );

  useEffect(() => {
    if (!isFirstRender && onFilter) {
      !isClearFilters && handleFilter(value);
      isClearFilters && onFilter('clear_filters_ignore_fetch');
    }
  }, [value]);

  useEffect(() => {
    !isFirstRender && isClearFilters && setValue('');
  }, [isClearFilters]);

  return (
    <WrapInput hasFeedback={false} onClick={(e) => e.stopPropagation()} className="m-0 p-0">
      <Input
        suffix={<SearchOutlined />}
        allowClear
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => {
          setValue(e.target.value);
        }}
        value={value}
        placeholder={placeholder}></Input>
    </WrapInput>
  );
}
export default InputFilter;
