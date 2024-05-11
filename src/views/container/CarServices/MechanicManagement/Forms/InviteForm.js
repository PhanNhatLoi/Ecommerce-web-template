import { CloseOutlined, MailOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { mechanicActions } from '~/state/ducks/mechanic';
import MInput from '~/views/presentation/fields/input/Input';
import MTextArea from '~/views/presentation/fields/input/TextArea';
import { ANT_FORM_MODAL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MInputStyled = styled(MInput)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
`;

const MTextAreaStyled = styled(MTextArea)`
  .ant-input-affix-wrapper {
    border: 1px solid #000 !important;
  }
  .ant-form-item-label {
    text-align: left;
  }
  .ant-input {
    border: 1px solid #000 !important;
  }
`;

const InviteModal = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitDisabled, setSubmitDisabled] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const onFinish = (values) => {};

  const onFinishFailed = (err) => {
    console.error('trandev ~ file: AddForm.js ~ line 14 ~ onFinishFailed ~ err', err);
  };

  return (
    <Form //
      {...ANT_FORM_MODAL_LAYOUT}
      form={form}
      onFinish={onFinish}
      requiredMark={false}
      onChange={() => setSubmitDisabled(!form.getFieldValue('phoneNumber') || !form.getFieldValue('content'))}
      colon={false}
      onFinishFailed={onFinishFailed}>
      <MInputStyled //
        noLabel
        noPadding
        label={t('phone_number') + 's'}
        name="phoneNumber"
        placeholder={t('enter_phone_numbers')}
        tooltip={{
          title: t('required_field'),
          icon: (
            <span>
              (<ATypography type="danger">*</ATypography>)
            </span>
          )
        }}
        extra={<span style={{ fontSize: '11px' }}>{t('invite_member_phone_extra')}</span>}
      />
      <MTextAreaStyled //
        noLabel
        rows={6}
        noPadding
        label={t('content') + 's'}
        name="content"
        placeholder={t('enter_content')}
        tooltip={{
          title: t('required_field'),
          icon: (
            <span>
              (<ATypography type="danger">*</ATypography>)
            </span>
          )
        }}
        extra={<span style={{ fontSize: '11px' }}>{t('invite_member_content_extra')}</span>}
      />

      <Form.Item
        wrapperCol={{
          sm: { span: 24 },
          lg: { offset: 8, span: 16 }
        }}>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
            className="px-5"
            size="large"
            disabled={submitDisabled}
            htmlType="submit"
            loading={submitting}
            type="primary"
            icon={<MailOutlined />}>
            {t('invite')}
          </AButton>

          <AButton
            style={{ verticalAlign: 'middle', width: '200px' }}
            className="mt-3 mt-lg-0 ml-lg-3 px-5"
            size="large"
            type="ghost"
            onClick={() => {
              form.resetFields();
              setSubmitDisabled(true);
              props.handleCancel();
            }}
            icon={<CloseOutlined />}>
            {props.cancelText || t('close')}
          </AButton>
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  deleteMechanic: mechanicActions.deleteMechanic,
  approveMechanic: mechanicActions.approveMechanic,
  blockMechanic: mechanicActions.blockMechanic,
  rejectMechanic: mechanicActions.rejectMechanic
})(InviteModal);
