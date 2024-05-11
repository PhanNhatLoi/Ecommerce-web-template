import { useTranslation } from 'react-i18next';
import { SendOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import QuotationInfoForm from '../Forms/QuotationInfoForm';

const UpdateQuotationModal = (props) => {
  const { t } = useTranslation();

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={`${t('update_quotation_new')}: 879543`}
      description={t('update_quotation_des')}
      width={1500}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <QuotationInfoForm
        id={props.id}
        isEditing={true}
        setNeedLoadNewData={props.setNeedLoadNewData}
        onCancel={handleCancel}
        submitIcon={<SendOutlined />}
        submitText={t('send_update_quotation')}
      />
    </AntModal>
  );
};

export default UpdateQuotationModal;
