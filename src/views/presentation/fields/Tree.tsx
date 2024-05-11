import { Form, Tree } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { commonValidate } from '~/views/utilities/ant-validation';

const InputStyled = styled.div`
  .ant-input-group-addon {
    border: none;
    border-bottom: 1px solid #000;
    background: none;
  }
`;

function MTree(props) {
  const { t }: any = useTranslation();
  const [rules, setRules] = useState(props.require ? commonValidate() : []);

  return (
    <InputStyled
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
        label={props?.label || ''}
        name={props?.name || 'Mtree'}
        rules={rules}
        labelAlign="left"
        tooltip={
          props.require && {
            title: t('required_field'),
            icon: (
              <span>
                (<ATypography type="danger">*</ATypography>)
              </span>
            )
          }
        }
        {...props}>
        <Tree
          checkable
          disabled={props.disabled}
          selectable={false}
          showIcon={false}
          checkedKeys={props.checkedKeys}
          onCheck={props.onCheck}
          treeData={props.treeData}
          {...props}
        />
      </Form.Item>
    </InputStyled>
  );
}

export default MTree;
