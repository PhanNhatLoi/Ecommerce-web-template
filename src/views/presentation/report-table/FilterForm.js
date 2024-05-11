import { Col, Form, Row } from 'antd/es';
import { head } from 'lodash-es';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';

const MSelectStyled = styled(MSelect)`
  .ant-select-selector,
  .ant-select:not(.ant-select-customize-input) .ant-select-selector {
    border: 1px solid #000;
    box-shadow: none;
  }
  label {
    margin-bottom: 0px !important;
    height: 100%;
  }
  .ant-form-item {
    margin-bottom: 0px !important;
  }
`;

const FilterForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    form.setFieldsValue(
      (props.filterList || [])?.map((filter) => {
        return { [filter?.name]: 0 };
      })
    );
  }, []);

  const getFields = (filterList) => {
    const children = [];
    for (let i = 0; i < filterList?.length; i++) {
      const currentFilter = filterList[i];
      children.push(
        <Col span={6} key={i}>
          <MSelectStyled //
            noLabel
            className="mb-0"
            hasFeedback={false}
            defaultValue={head(currentFilter?.options)?.value}
            colon={false}
            label={t(currentFilter?.label)}
            name={currentFilter?.name}
            options={currentFilter?.options?.map((option) => {
              return { label: t(option?.label), value: option?.value };
            })}
          />
        </Col>
      );
    }
    children.push(
      <Col span={6}>
        <AButton size="large" type="primary" htmlType="submit">
          {t('generate')}
        </AButton>
      </Col>
    );
    return children;
  };

  const onFinish = (values) => {
    props.setParams({ ...values });
  };

  const onFinishFailed = (error) => {
    console.error('trandev ~ file: FilterForm.js ~ line 70 ~ onFinishFailed ~ error', error);
  };

  return (
    <div className={props.className} style={props.style}>
      <Form form={form} name="advanced_search" className="ant-advanced-search-form" onFinish={onFinish} onFinishFailed={onFinishFailed}>
        <Row gutter={12} className="align-items-center">
          {getFields(props.filterList || [])}
          <Col className="d-flex justify-content-end" span={6}>
            <AButton disabled size="large" type="primary">
              {t('advanced_report')}
            </AButton>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default FilterForm;
