import { Form, Select } from 'antd/es';
import { isArray, isString } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';
import { replaceVniToEng } from '~/views/utilities/helpers/string';
import COLOR from '~/views/utilities/layout/color';

const SelectStyled = styled.div`
  .ant-select-selection-item {
    display: flex;
  }
  .ant-select-disabled.ant-select:not(.ant-select-customize-input) .ant-select-selector {
    color: ${COLOR.Black};
  }
`;

function MSelect(props) {
  const { t } = useTranslation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [rules, setRules] = useState(props.require ? commonValidate() : []);

  useEffect(() => {
    if (props.fetchData) {
      setLoading(true);
      const queries = {
        page: props.isMock ? 1 : 0,
        limit: props.isMock ? 100 : undefined,
        size: props.isMock ? undefined : 99999999,
        ...props.params
      };
      props
        .fetchData(queries)
        .then((res) => {
          setData(
            (res?.content?.filter(Boolean) || []).map(
              props.customDataResponse ||
                ((o) => {
                  return {
                    ...o,
                    value: o[props.valueProperty || 'id'],
                    label: props.labelCustom ? props.labelCustom(o) : o[props.labelProperty || 'name'],
                    search: o[props.labelProperty || 'name']
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
    <SelectStyled
      className={
        (props.noPadding ? 'px-0  ' : '') +
        (props.noLabel
          ? props.hasLayoutForm
            ? 'col-12 col-sm-12 col-md-12 col-lg-12 col-xl-10'
            : 'col-12'
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
        {...props}
        label={props.label || ''}
        name={props.name || 'MSelect'}
        rules={rules}
        hasFeedback={props.hasFeedback}
        tooltip={
          props.tooltip ||
          (props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          })
        }
        validateStatus={props.loading || loading ? 'validating' : undefined}>
        <Select
          mode={props.mode}
          autoComplete={props.autoComplete}
          allowClear={props.allowClear}
          disabled={props.disabled}
          defaultValue={props.defaultValue}
          size={props.size || 'large'}
          className="w-100"
          filterOption={(input, option) => {
            const childrenOption = isArray(option?.children)
              ? option?.children.join('')
              : !isString(option?.children)
              ? option?.search
              : isString(option?.children)
              ? option?.children
              : option?.value;
            if (props?.searchCorrectly) return childrenOption?.toLowerCase()?.indexOf(input?.toLowerCase()) >= 0;
            else return replaceVniToEng(childrenOption?.toLowerCase())?.indexOf(replaceVniToEng(input?.toLowerCase())) >= 0;
          }}
          onChange={props.onChange}
          onSearch={(value) => props?.onSearch?.(value)}
          optionFilterProp="children"
          optionLabelProp="label"
          placeholder={props.placeholder || 'MSelect'}
          showSearch>
          {(props.options || data).map((o) => {
            return (
              <Select.Option key={`${props.name}${o?.value}`} value={o?.value} label={o?.label} search={o?.search} disabled={o?.disabled}>
                {(props.renderOptions && props.renderOptions(o)) || o?.children || o?.label}
              </Select.Option>
            );
          })}
        </Select>
      </Form.Item>
    </SelectStyled>
  );
}

export default MSelect;
