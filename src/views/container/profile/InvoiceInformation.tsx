import { EditFilled } from '@ant-design/icons';
import { Form, Tooltip } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router-dom';
import { Breadcrumbs } from '~/configs/breadcrumbs';
import * as roleBaseStatus from '~/configs/status/settings/roleBaseStatus';
import { authActions, authSelectors } from '~/state/ducks/authUser';
import { useSubheader } from '~/views/presentation/core/Subheader';
import { MInput } from '~/views/presentation/fields/input';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';

function InvoiceInformation(props) {
  const { t }: any = useTranslation();
  const subheader = useSubheader();
  const [form] = Form.useForm();

  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [disableSubmit, setDisableSubmit] = useState(true);
  const [dirty, setDirty] = useState(false);
  const [user, setUser] = useState<any>();

  useEffect(() => {
    subheader.setBreadcrumbs(Breadcrumbs.personalInformationPage);
  }, []);

  useEffect(() => {
    if (props.getAuthUser) {
      const otherData = props.getAuthUser?.otherData;
      form.setFieldsValue({
        companyName: otherData?.companyName,
        invoiceAddress: otherData?.invoiceAddress,
        invoiceEmail: otherData?.invoiceEmail,
        tax: otherData?.tax
      });
      setUser({
        ...otherData,
        companyName: otherData?.companyName,
        invoiceAddress: otherData?.invoiceAddress,
        invoiceEmail: otherData?.invoiceEmail,
        tax: otherData?.tax
      });
    }
  }, [props.getAuthUser]);

  const InvoiceInfo = () => (
    <div className="form">
      <div className="card-body">
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('companyPersonalName')}</label>
          <div className="col-lg-9 col-xl-6 d-flex align-items-center">
            <ATypography strong style={{ fontSize: '12px' }}>
              {user?.companyName || '-'}
            </ATypography>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('address')}</label>
          <div className="col-lg-9 col-xl-6 d-flex align-items-center">
            <ATypography strong style={{ fontSize: '12px' }}>
              {user?.invoiceAddress || '-'}
            </ATypography>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('Email')}</label>
          <div className="col-lg-9 col-xl-6 d-flex align-items-center">
            <ATypography strong style={{ fontSize: '12px' }}>
              {user?.invoiceEmail || '-'}
            </ATypography>
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('taxId')}</label>
          <div className="col-lg-9 col-xl-6 d-flex align-items-center">
            <ATypography strong style={{ fontSize: '12px' }}>
              {user?.tax || '-'}
            </ATypography>
          </div>
        </div>
      </div>
    </div>
  );

  const InvoiceEdit = () => (
    <div className="form">
      <div className="card-body">
        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('companyPersonalName')}</label>
          <div className="col-lg-9 col-xl-7">
            <MInput noLabel loading={false} noPadding wrapperCol={{ span: 24 }} require={false} name="companyName" />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('address')}</label>
          <div className="col-lg-9 col-xl-7">
            <MInput noLabel loading={false} noPadding wrapperCol={{ span: 24 }} require={false} name="invoiceAddress" />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('Email')}</label>
          <div className="col-lg-9 col-xl-7">
            <MInput noLabel loading={false} noPadding wrapperCol={{ span: 24 }} require={false} name="invoiceEmail" />
          </div>
        </div>

        <div className="form-group row">
          <label className="col-xl-3 col-lg-3 col-form-label text-muted">{t('taxId')}</label>
          <div className="col-lg-9 col-xl-7 d-flex align-items-center">
            <MInput noLabel loading={false} noPadding wrapperCol={{ span: 24 }} require={false} name="tax" />
          </div>
        </div>
      </div>
    </div>
  );

  const onFinish = async (values) => {
    setSubmitting(true);

    const body = {
      otherData: {
        ...user,
        companyName: values?.companyName,
        invoiceAddress: values?.invoiceAddress,
        invoiceEmail: values?.invoiceEmail,
        tax: values?.tax
      }
    };

    await props
      .updateUser(body)
      .then(() => {
        props.logout();
      })
      .catch(() => {
        AMessage.success(t('update_profile_success'));
        props.getUser().finally(() => {
          setIsEditing(false);
          setSubmitting(false);
        });
      });
  };

  const onValuesChange = () => {
    setDisableSubmit(false);
    setDirty(true);
  };

  const onFinishFailed = (error) => {
    console.error('🚀chiendev ~ file: InvoiceInformation.tsx:153 ~ onFinishFailed ~ error:', error);
  };

  return (
    <Form //
      form={form}
      scrollToFirstError={{
        behavior: 'smooth',
        block: 'center',
        inline: 'center',
        scrollMode: 'always'
      }}
      onFinish={onFinish}
      onValuesChange={onValuesChange}
      onFinishFailed={onFinishFailed}>
      <Prompt when={dirty} message={t('leave_confirm')} />
      <div className="card card-custom card-stretch">
        <div className="card-header py-3">
          <div className="card-title align-items-start flex-column">
            <div className="d-flex align-items-center">
              <h3 className="card-label font-weight-bolder text-dark mr-2">{isEditing ? t('edit_invoice') : t('invoice_info')}</h3>
              {roleBaseStatus.isVendor() && !isEditing && (
                <Tooltip title={t('edit_invoice')}>
                  <AButton
                    type="link"
                    size="large"
                    onClick={() => {
                      setIsEditing(true);
                    }}
                    icon={<EditFilled style={{ color: '#000' }} />}
                  />
                </Tooltip>
              )}
            </div>
            <span className="text-muted font-weight-bold font-size-sm mt-1">
              {isEditing ? t('edit_invoice_des') : t('invoice_info_des')}
            </span>
          </div>
          {isEditing && (
            <div className="card-toolbar">
              <AButton type="primary" className="mr-5" onClick={() => setIsEditing(false)}>
                {t('back')}
              </AButton>
              <AButton type="primary" htmlType="submit" loading={submitting} disabled={disableSubmit}>
                {t('save_changes')}
              </AButton>
            </div>
          )}
        </div>

        {isEditing ? InvoiceEdit() : InvoiceInfo()}
      </div>
    </Form>
  );
}

export default connect(
  (state: any) => ({
    getAuthUser: authSelectors.getAuthUser(state)
  }),
  {
    getUser: authActions.getUser,
    updateUser: authActions.updateUser
  }
)(InvoiceInformation);
