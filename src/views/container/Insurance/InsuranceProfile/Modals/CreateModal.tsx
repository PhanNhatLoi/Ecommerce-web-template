import { CheckOutlined, CloseOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AntModal from '~/views/presentation/ui/modal/AntModal';

type CreateModalProps = {
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
};

export const CreateModal: React.FC<CreateModalProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleCancel = () => {
    form.resetFields();
    props.setModalShow(false);
  };

  const onFinish = (values) => {
    setLoading(true);
    history.push(PATH.INSURANCE_PROFILE_NEW_PATH.replace(':insuranceType', values.package));
    setLoading(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('selectInsurancePackage')}
        description={''}
        width={500}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <Form //
          {...ANT_FORM_SEP_LABEL_LAYOUT}
          form={form}
          onFinish={onFinish}>
          <MSelect
            name="package"
            label={t('package_insurance')}
            placeholder={t('package_insurance')}
            required
            noPadding
            noLabel
            options={Object.keys(INSURANCE_PACKAGE_TYPE).map((type) => {
              return {
                value: type,
                label: t(type)
              };
            })}
          />
          <Divider />

          <Form.Item>
            <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
              <AButton
                style={{ verticalAlign: 'middle', width: '150px' }}
                className="mt-3 mt-lg-0 mr-lg-3 px-5"
                size="large"
                type="ghost"
                onClick={handleCancel}
                icon={<CloseOutlined />}>
                {t('close')}
              </AButton>
              <AButton
                style={{ verticalAlign: 'middle', minWidth: '150px' }}
                className="px-5"
                loading={loading}
                size="large"
                htmlType="submit"
                type="primary"
                icon={<CheckOutlined />}
                onClick={() => form.submit()}>
                {t('confirm')}
              </AButton>
            </div>
          </Form.Item>
        </Form>
      </AntModal>
    </HOC>
  );
};

export default CreateModal;
