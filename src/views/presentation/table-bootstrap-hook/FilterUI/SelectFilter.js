import { Form, Select } from 'antd/es';
import { isArray, isString } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { replaceVniToEng } from '~/views/utilities/helpers/string';

const SelectStyled = styled(Form.Item)`
  .ant-select-selector,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    // border-bottom: 1px solid rgba(0, 0, 0, 0.25) !important;
    border-radius: 8px;
    // border: 1px solid #eaeaea;
    // background: #fff;
  }

  .ant-select-selection-selected-value {
    width: 100%;
  }
`;

function SelectFilter(props) {
  const [value, setValue] = useState(undefined);
  const [loading, setLoading] = useState('');
  const [clearing, setClearing] = useState(false);
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    if (props.isClearFilter) {
      setClearing(true);
      setLoading();
      setValue();
      setFocus(false);
      props.onFilter && props.onFilter('');
    }
  }, [props.isClearFilter]);

  useEffect(() => {
    if (props.resetFilter) {
      setValue();
      props.setResetFilter(false);
    }
  }, [props.resetFilter]);

  const params = { ...props.params, limit: 100 };

  // FOR MOCK API
  if (props.mock) {
    params.page = 1;
  } else {
    params.page = 0;
  }
  // FOR MOCK API

  // for have data options
  const [dataSource, setDataSource] = useState([]);
  useEffect(() => {
    if (props.fetchData) {
      setLoading(true);
      props
        .fetchData(params) // NEED EDIT WHEN CHANGE API
        .then((res) => {
          setDataSource(
            (res?.content || []).map((o) => {
              return {
                value: o[props.valueProperty || 'id'],
                label: props.labelCustom ? props.labelCustom(o) : o[props.labelProperty || 'name'],
                search: o[props.labelProperty || 'name']
              };
            })
          );
          setLoading(false);
        })
        .catch((err) => {
          setLoading(false);
          console.error(`ithoangtan -  ~ file: Select.js ~ line 11 ~ props.fetchData ~ err`, err);
        });
    }
  }, []);

  return (
    <SelectStyled
      onClick={(e) => e.stopPropagation()} // very important for stop propagation (impact sorter of react-table-2)
      className="m-0 p-0"
      validateStatus={loading}
      hasFeedback={false}
      label=""
      colon={false}>
      <Select
        key={Date.now()}
        allowClear
        mode={props.mode}
        autoFocus={props.autoFocus || focus}
        defaultOpen={props.defaultOpen || focus}
        onClear={props.onClear}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        onSelect={() => setFocus(false)}
        onChange={(val) => {
          if (val) {
            props.onFilter && props.onFilter(val);
            setLoading('success');
          } else {
            !clearing && props.onFilter && props.onFilter(val);
            setLoading();
          }
          setValue(val);
          setClearing(false);
          setFocus(false);
        }}
        value={value}
        placeholder={props.placeholder}
        className="w-100"
        style={{ minWidth: 132, ...props.style }}
        dropdownStyle={{ minWidth: 'fit-content' }}
        // search
        showSearch={props.showSearch || true}
        filterOption={(input, option) => {
          const childrenOption = isArray(option?.children)
            ? option?.children.join('')
            : isString(option?.children)
            ? option?.search
            : option?.value;
          return replaceVniToEng(childrenOption?.toString()?.toLowerCase())?.indexOf(replaceVniToEng(input?.toLowerCase())) >= 0;
        }}>
        {!props.fetchData &&
          (props.options || []).map((o) => {
            {
              return (
                <Select.Option value={o.value} search={o.search}>
                  {o.label}
                </Select.Option>
              );
            }
          })}
        {props.fetchData &&
          dataSource.map((o) => {
            return (
              <Select.Option value={o.value} search={o.search}>
                {o.label}
              </Select.Option>
            );
          })}
      </Select>
    </SelectStyled>
  );
}

export default SelectFilter;
