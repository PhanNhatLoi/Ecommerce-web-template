import { Form, Select } from 'antd/es';
import { isArray, isString } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { commonValidate } from '~/views/utilities/ant-validation';
import { replaceVniToEng } from '~/views/utilities/helpers/string';
import COLOR from '~/views/utilities/layout/color';

const MultiSelectStyled = styled.div`
  .ant-select-clear {
    transform: translateY(-3px);
    -webkit-transform: translateY(-3px);
    -moz-transform: translateY(-3px);
    -ms-transform: translateY(-3px);
    -o-transform: translateY(-3px);
  }
  .ant-select-disabled.ant-select-multiple .ant-select-selection-item {
    color: ${COLOR.Black};
  }
`;

function MMultiSelect(props) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  let rules = [];
  if (props.require !== false) {
    rules = commonValidate();
  }

  useEffect(() => {
    if (props.fetchData) {
      setLoading(true);
      const queries = {
        page: props.isMock ? 1 : 0,
        limit: props.isMock ? 100 : undefined,
        size: props.isMock ? undefined : 10000,
        ...props.params
      };
      props
        .fetchData(queries)
        .then((res) => {
          setData(
            (res?.content || []).map(
              props.customDataResponse ||
                ((o) => {
                  return {
                    value: o[props.valueProperty || 'id'],
                    label: props.labelCustom ? props.labelCustom(o) : o[props.labelProperty || 'name'],
                    search: o[props.labelProperty || 'name'],
                    ...o
                  };
                })
            )
          );
          setLoading(false);
        })
        .catch((err) => {
          console.error(`file: Select.js ~ line 31 ~ useEffect ~ err`, err);
          setLoading(false);
        });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.params]);

  return (
    <MultiSelectStyled
      className={
        (props.noPadding ? 'px-0  ' : '') +
        (props.noLabel
          ? 'col-12'
          : props.oneLine
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6'
          : props.customLayout
          ? props.customLayout
          : props.hasLayoutForm
          ? 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-5'
          : 'col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6')
      }>
      {props.copyBtn || <></>}
      <Form.Item
        label={props.label || ''}
        name={props.name || ''}
        {...props}
        rules={rules}
        validateStatus={props.validateStatus || loading ? 'validating' : undefined}>
        <Select
          allowClear
          tagRender={props.tagRender}
          mode="multiple"
          className="w-100"
          filterOption={(input, option) => {
            const childrenOption = isArray(option?.children)
              ? option?.children.join('')
              : !isString(option?.children)
              ? option?.search
              : isString(option?.children)
              ? option?.children
              : option?.value;
            if (props.searchCorrectly) return childrenOption?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0;
            else return replaceVniToEng(childrenOption?.toLowerCase())?.indexOf(replaceVniToEng(input?.toLowerCase())) >= 0;
          }}
          optionFilterProp="children"
          placeholder={props.placeholder || ''}
          showSearch
          size={props.size || 'large'}
          disabled={props.disabled}
          hasFeedback={props.hasFeedback || true}
          {...props}>
          {(props.options || data).map((o) => {
            return props.optionRender ? (
              props.optionRender(o.value, o.label, o.search)
            ) : (
              <Select.Option key={`${props.name}${o.value}`} value={o.value} search={o.search}>
                {o.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </MultiSelectStyled>
  );
}

export default MMultiSelect;
