import React from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import InfoForm from '../Forms/InfoForm';
import AMessage from '~/views/presentation/ui/message/AMessage';

type ActionModalProps = {
  id: string | number;
  modalShow: boolean;
  setModalShow: (value: boolean) => void;
  fullAccessPage: boolean;
  voucherProps: any;
  setCurrentVoucher: any;
  setNeedLoad: React.Dispatch<React.SetStateAction<boolean>>;
};

const ActionModal: React.FC<ActionModalProps> = (props) => {
  const { t }: any = useTranslation();

  const { voucherProps, setNeedLoad } = props;

  const handleCancel = () => {
    props.setCurrentVoucher();
    props.setModalShow(false);
  };

  const onFinish = () => {
    AMessage.success(t('assignProductServiceSuccess'));
    props.setCurrentVoucher();
    props.setModalShow(false);
    setNeedLoad(true);
  };

  return (
    <AntModal
      title={t('voucherDetail')}
      description={t('')}
      width={1200}
      destroyOnClose
      modalShow={props.modalShow}
      onOk={onFinish}
      onCancel={handleCancel}>
      <InfoForm voucherProps={voucherProps} onSubmitForm={onFinish} onCancel={handleCancel} />
    </AntModal>
  );
};

export default ActionModal;
