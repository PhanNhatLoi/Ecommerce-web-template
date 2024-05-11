import { Form, InputNumber } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import styled from 'styled-components';

const WrapStyleInputNumber = styled(Form.Item)`
  position: relative;
  .clear_icon_custom {
    position: absolute;
    font-size: 14px !important;
    right: 10px;
    top: 9px;
  }
`;

const InputNumberWrapStyled = styled(InputNumber)`
  font-size: 13px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.25);
  .ant-input-number-handler-wrap {
    display: none;
  }
`;

function InputNumberFilter(props) {
  const [value, setValue] = useState('');
  const [loading, setLoading] = useState('');
  const [clearing, setClearing] = useState(false);

  const [, cancel] = useDebounce(
    () => {
      !clearing && props.onFilter && props.onFilter(value);
      value && setLoading('success');
      !value && setLoading('');
      setClearing(false);
    },
    props.delay ? props.delay : 500,
    [value]
  );

  useEffect(() => {
    if (props.isClearFilter) {
      setClearing(true);
      setLoading();
      setValue();
      props.onFilter && props.onFilter('');
    }
  }, [props.isClearFilter]);
  return (
    <WrapStyleInputNumber
      onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
      className="m-0 p-0"
      validateStatus={loading}
      hasFeedback={false}
      label=""
      colon={false}>
      <InputNumberWrapStyled
        className="w-100"
        min={props.min || 0}
        max={Number.MAX_SAFE_INTEGER}
        maxLength={(props.max + '').length}
        step={props.step || 1}
        onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
        onChange={(value) => {
          if (props.max && value > props.max) {
            setValue(props.max);
          } else setValue(value);
          setLoading('validating');
        }}
        value={value}
        // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, ',')}
        parser={(value) => value.replace(/\$\s?|(,*)/g, '')}
        placeholder={props.placeholder}></InputNumberWrapStyled>
      {value ? (
        <span className="ant-input-suffix clear_icon_custom">
          <span
            aria-label="close-circle"
            tabindex="-1"
            className="anticon anticon-close-circle ant-input-clear-icon"
            onClick={() => {
              setValue();
            }}>
            <svg
              viewBox="64 64 896 896"
              focusable="false"
              data-icon="close-circle"
              width="1em"
              height="1em"
              fill="currentColor"
              aria-hidden="true">
              <path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 01-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path>
            </svg>
          </span>
        </span>
      ) : (
        <></>
      )}
    </WrapStyleInputNumber>
  );
}
export default InputNumberFilter;
