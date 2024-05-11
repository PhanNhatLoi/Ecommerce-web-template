import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Form, message, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AVATAR } from '~/configs/default';
import { bankingActions } from '~/state/ducks/settings/banking';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { commonValidate, nameValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const InfoForm = (props) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (props.id) {
      props
        .getBankAccountDetail(props.id)
        .then((res) => {
          form.setFieldsValue({
            ...res?.content
          });
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 41 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
        });
    }
  }, [props.id]);

  const onFinish = (values) => {
    setSubmitting(true);
    if (props.id) {
      props
        .updateBankAccount({ id: props.id, body: { ...values, id: props.id } })
        .then((res) => {
          AMessage.success(t('update_bank_account_success'));
          props.onOk();
          props.setNeedLoadNewData(true);
          setSubmitting(false);
        })
        .catch((err) => {
          AMessage.error(t(err.message));
          console.error('trandev ~ file: InfoForm.js ~ line 86 ~ onFinish ~ err', err);
        });
    } else {
      props
        .createBankAccount(values)
        .then((res) => {
          AMessage.success(t('create_bank_account_success'));
          props.onOk();
          props.setNeedLoadNewData(true);
          form.resetFields();
          setSubmitting(false);
        })
        .catch((err) => {
          AMessage.error(t(err.message));
          console.error('trandev ~ file: InfoForm.js ~ line 72 ~ onFinish ~ err', err);
        });
    }
  };

  const onFinishFailed = (err) => {
    setSubmitting(false);
  };

  const handleValuesChange = () => {
    props.setDirty(true);
  };

  return (
    <Form //
      requiredMark={false}
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}
      onFinish={onFinish}
      onFinishFailed={onFinishFailed}
      onValuesChange={handleValuesChange}>
      <Row>
        <MSelect
          require
          label={t('choose_bank_name')}
          name="bankId"
          noLabel
          valueProperty="id"
          labelProperty="shortName"
          placeholder={t('choose_bank_name')}
          fetchData={props.getGlobalBankList}
          searchCorrectly={false}
          renderOptions={(option) => {
            let src = option?.logo && !option?.logo?.includes(' ') ? firstImage(option?.logo) : DEFAULT_AVATAR;
            return (
              <div className="d-flex align-items-center" style={{ lineHeight: 'initial' }}>
                <span>
                  <AuthAvatar
                    className="mr-3"
                    preview={{
                      mask: <EyeOutlined />
                    }}
                    width={32}
                    size={32}
                    isAuth={true}
                    src={src}
                    onClick={(e) => e.stopPropagation()}
                  />
                </span>
                <span>
                  <strong>{option?.shortName}</strong>
                  <br />
                  <p className="mb-0">{option?.name}</p>
                </span>
              </div>
            );
          }}
        />

        <MInput
          name="accountNumber"
          noLabel
          label={t('account_number')}
          placeholder={t('')}
          require
          mRules={[
            ...commonValidate(),
            {
              pattern: /^[A-Za-z0-9_.]+$/,
              message: t('account_number_invalid')
            }
          ]}
        />
        <MInput
          name="accountName"
          noLabel
          label={t('account_name')}
          placeholder={t('')}
          require
          mRules={[...commonValidate(), ...nameValidate()]}
        />
      </Row>

      <Divider />
      <Form.Item>
        <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
          <BasicBtn size="large" htmlType="submit" loading={submitting} type="primary" icon={props.submitIcon} title={props.submitText} />
          <BasicBtn
            size="large"
            type="ghost"
            onClick={() => {
              // form.resetFields();
              props.onCancel();
            }}
            icon={<CloseOutlined />}
            title={props.cancelText || t('close')}
          />
        </div>
      </Form.Item>
    </Form>
  );
};

export default connect(null, {
  getGlobalBankList: bankingActions.getGlobalBankList,
  getBankAccountDetail: bankingActions.getBankAccountDetail,
  createBankAccount: bankingActions.createBankAccount,
  updateBankAccount: bankingActions.updateBankAccount
})(InfoForm);
