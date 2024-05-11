import React from 'react';
import { useTranslation } from 'react-i18next';
import { Form } from 'antd/es';
import { SaveOutlined } from '@ant-design/icons';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import SpecificationInfoForm from '../Forms/specificationInfoForm';

const EditSpecificationModal = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = (dirty) => {
    if (dirty) {
      // eslint-disable-next-line no-restricted-globals
      if (confirm(t('leave_confirm'))) {
        props.setModalShow(false);
        form.resetFields();
      }
    } else {
      props.setModalShow(false);
      form.resetFields();
    }
  };

  return (
    <AntModal
      title={`${t('specification_edit')}`}
      description={t('specification_edit_des')}
      width={1200}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      {
        <SpecificationInfoForm //
          form={form}
          isModal
          isEditing={true}
          id={props.id}
          setNeedLoadNewData={props.setNeedLoadNewData}
          submitIcon={<SaveOutlined />}
          submitText={t('save')}
          onCancel={handleCancel}
        />
      }
    </AntModal>
  );
};

export default EditSpecificationModal;
