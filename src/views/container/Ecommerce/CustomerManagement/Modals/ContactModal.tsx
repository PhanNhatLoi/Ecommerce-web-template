import { UserAddOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ContactType } from '~/state/ducks/customer/actions';
import AntModal from '~/views/presentation/ui/modal/AntModal';

import ContactForm from '../Forms/ContactForm';

type ContactModalProps = {
  contactIndex: number | undefined;
  modalShow: boolean;
  contactList: ContactType[];
  setContactList: React.Dispatch<React.SetStateAction<ContactType[]>>;
  setModalShow: (value: boolean) => void;
};

const ContactModal: React.FC<ContactModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  return (
    <AntModal
      title={props.contactIndex !== undefined ? t('customer_contact_edit') : t('customer_contact_new')}
      width={800}
      modalShow={props.modalShow}
      destroyOnClose
      submitDisabled={false}
      onCancel={handleCancel}
      hasSubmit>
      <ContactForm
        contactIndex={props.contactIndex}
        contactList={props.contactList}
        setContactList={props.setContactList}
        onCancel={handleCancel}
        submitIcon={<UserAddOutlined />}
        submitText={props.contactIndex !== undefined ? t('save_changes') : t('add')}
      />
    </AntModal>
  );
};

export default ContactModal;
