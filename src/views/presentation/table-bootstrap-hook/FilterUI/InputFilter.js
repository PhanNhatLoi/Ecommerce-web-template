import { SearchOutlined } from '@ant-design/icons';
import { Form, Input } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useDebounce } from 'react-use';
import styled from 'styled-components';
import SVG from 'react-inlinesvg';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

const InputWrapStyled = styled(Input)`
  border-radius: 8px;
  .ant-input-clear-icon {
    font-size: 14px !important;
    position: relative;
    top: -4px;
  }
`;

function InputFilter(props) {
  const [value, setValue] = useState(undefined);
  const [loading, setLoading] = useState('');
  const [clearing, setClearing] = useState(false);

  const [, cancel] = useDebounce(
    () => {
      if (value !== undefined) {
        !clearing && props.onFilter && props.onFilter(value);
        value && setLoading('success');
        !value && setLoading('');
        setClearing(false);
      }
    },
    props.delay ? props.delay : 500,
    [value]
  );

  useEffect(() => {
    if (props.isClearFilter) {
      setClearing(true);
      setLoading(false);
      setValue(null);
      props.onFilter && props.onFilter('');
    }
  }, [props.isClearFilter]);

  return (
    <Form.Item
      onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
      className="m-0 p-0"
      validateStatus={loading}
      hasFeedback={false}
      label=""
      colon={false}>
      <InputWrapStyled
        prefix={<SVG src={toAbsoluteUrl('/media/svg/icons/Tools/Search.svg')} />}
        allowClear
        onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
        onChange={(e) => {
          setValue(e.target.value);
          setLoading('validating');
        }}
        value={value}
        placeholder={props.placeholder}></InputWrapStyled>
    </Form.Item>
  );
}
export default InputFilter;
