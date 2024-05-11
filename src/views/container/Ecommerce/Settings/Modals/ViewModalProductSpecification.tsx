import { SaveOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import ProductSpecificationForm from '../Forms/ProductSpecificationForm';
import ViewForm from '../Forms/ViewForm';

const ViewModalProductSpecification = (props) => {
  const { t }: any = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [form] = Form.useForm();
  const history = useHistory();

  const handleCancel = (dirty = false) => {
    if (dirty && isEditing) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(t('leave_confirm'))) {
        props.setModalShow(false);
        form.resetFields();
        setIsEditing(false);
      }
    } else {
      props.setModalShow(false);
      form.resetFields();
    }
    setIsEditing(false);
  };

  const onFinish = () => {};

  return (
    <AntModal
      title={t('product_specification_detail')}
      description={t('product_specification_detail_des')}
      width={800}
      supportEdit={!isEditing}
      onEdit={() => {
        setIsEditing(true);
        history.push(`${PATH.CAR_ACCESSORIES_PRODUCT_SPECIFICATION_FORM}?id=${props.data.id}`);
      }}
      modalShow={props.modalShow}
      destroyOnClose
      onOk={onFinish}
      onCancel={handleCancel}>
      {isEditing ? (
        <ProductSpecificationForm //
          isEditing={true}
          setIsEditing={setIsEditing}
          id={props.id}
          form={form}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      ) : (
        <ViewForm data={props.data} onCancel={handleCancel} />
      )}
    </AntModal>
  );
};

export default ViewModalProductSpecification;
