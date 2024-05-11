import { SendOutlined } from '@ant-design/icons';
import React from 'react';
import { useTranslation } from 'react-i18next';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import QuotationInfoForm from '../Forms/QuotationInfoForm';

const SendQuotationModal = (props) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={t('quotation_new')}
      description={t('quotation_new_des')}
      width={1500}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <QuotationInfoForm
        isEditing={false}
        selectedProblems={props.selectedProblems}
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        onViewDetailCancel={props.onViewDetailCancel}
        submitIcon={<SendOutlined />}
        submitText={t('send_quotation')}
      />
    </AntModal>
  );
};

export default SendQuotationModal;
