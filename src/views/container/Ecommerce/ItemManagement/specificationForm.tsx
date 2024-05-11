import React from 'react';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig.js';
import { useTranslation } from 'react-i18next';
import { Card as BCard, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import styled from 'styled-components';

import { PlusOutlined, LeftOutlined } from '@ant-design/icons';
import { Breadcrumb, Form } from 'antd/es';
import { BackBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import SpecificationInfoForm from './Forms/specificationInfoForm';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

const SpecificationForm = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const handleCancel = () => {
    // form.resetFields();
  };

  return (
    <SpecificationInfoForm
      isPage
      form={form}
      secondarySubmitText={t('create')}
      onCancel={handleCancel}
      submitIcon={<PlusOutlined />}
      submitText={t('create_and_continue')}
    />
  );
};

export default SpecificationForm;
