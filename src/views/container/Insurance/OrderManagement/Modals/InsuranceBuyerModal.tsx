import { CloseOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import CustomerForm from '../../CustomerManagement/Forms/CustomerForm';

type InsuranceBuyerModalProps = {
  buyerId: number;
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const InsuranceBuyerModal: React.FC<InsuranceBuyerModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('buyerAccountDetail')}
        description={''}
        width={1000}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <Form //
          {...ANT_FORM_SEP_LABEL_LAYOUT}
          form={form}>
          <CustomerForm form={form} buyerId={props.buyerId} allowEdit={false} />

          <Divider />

          <div className="d-flex align-items-center justify-content-center">
            <AButton
              style={{ verticalAlign: 'middle', width: '150px' }}
              className="mt-3 mt-lg-0 mr-lg-3 px-5"
              size="large"
              type="ghost"
              onClick={handleCancel}
              icon={<CloseOutlined />}>
              {t('close')}
            </AButton>
          </div>
        </Form>
      </AntModal>
    </HOC>
  );
};

export default InsuranceBuyerModal;
