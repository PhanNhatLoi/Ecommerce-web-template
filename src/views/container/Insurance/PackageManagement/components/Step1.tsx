import { EyeOutlined, QuestionCircleOutlined } from '@ant-design/icons';
import { Form } from 'antd/es';
import { head, last } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { INSURANCE_PACKAGE_TYPE } from '~/configs/status/Insurance/packageStatus';
import { ACCEPT_IMAGE_UPLOAD } from '~/configs/upload';
import Divider from '~/views/presentation/divider';
import { MCKEditor, MInput } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import { MUploadImageCropWithBtn } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { NextBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

type InsurancePackageStep1Props = {
  viewEditForm?: any;
  progress?: number[];
  setProgress?: React.Dispatch<React.SetStateAction<number[]>>;
  currentStep?: number;
  setCurrentStep?: React.Dispatch<React.SetStateAction<number>>;
  formValues: any;
  setFormValues?: React.Dispatch<React.SetStateAction<{}>>;
  allowEdit: boolean;
  bannerFile?: any;
  setBannerFile?: any;
};

const InsurancePackageStep1: React.FC<InsurancePackageStep1Props> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [details, setDetails] = useState('');
  const [bannerFile, setBannerFile] = useState<any>();

  useEffect(() => {
    form.setFieldsValue({
      name: props.formValues?.name,
      packageType: props.formValues?.packageType,
      banner: props.formValues?.banner,
      informationSubject: props.formValues?.informationSubject
    });
    setBannerFile(firstImage(props.formValues?.banner));
    setDetails(props.formValues?.details);
  }, [props.formValues]);

  const onFinish = (values: any) => {
    if (
      props.setProgress &&
      props.progress !== undefined &&
      props.setCurrentStep &&
      props.currentStep !== undefined &&
      props.setFormValues
    ) {
      props.setFormValues((prevState) => ({ ...prevState, ...values }));
      props.setProgress([...props.progress, props.progress.length]);
      props.setCurrentStep(props.currentStep + 1);
    }
  };

  const onDetailsChange = (value: string) => {
    form.setFieldValue('details', value);
    props.viewEditForm && props.viewEditForm?.setFieldValue('details', value);
  };

  const onBannerChange = (file) => {
    setBannerFile(firstImage(last(file)) || '');
    form.setFieldValue('banner', head(file));
    props.setBannerFile && props.setBannerFile(firstImage(last(file)) || '');
    props.viewEditForm && props.viewEditForm?.setFieldValue('banner', head(file));
  };

  return (
    <>
      {props.viewEditForm ? (
        <LayoutForm title={t('generalInfo')} description={t('')}>
          <div className="mb-10">
            <MInput
              name="name"
              label={t('insurancePackageName')}
              placeholder={t('insurancePackageName')}
              hasFeedback
              require={true}
              readOnly={!props.allowEdit}
              noLabel
              noPadding
            />
          </div>

          <div className="mb-10">
            <MSelect
              name="packageType"
              label={t('insurancePackageType')}
              placeholder={t('insurancePackageType')}
              hasFeedback
              require={true}
              noLabel
              noPadding
              searchCorrectly={false}
              disabled={!props.allowEdit}
              options={Object.keys(INSURANCE_PACKAGE_TYPE).map((type) => {
                return {
                  value: type,
                  label: t(type)
                };
              })}
            />
          </div>

          <div className="mb-10">
            <MUploadImageCropWithBtn
              name="banner"
              label={t('banner')}
              helperText={t('helperUploadPromotion')}
              accept={ACCEPT_IMAGE_UPLOAD}
              noLabel
              noPadding
              aspect={3 / 1}
              require={true}
              disabled={!props.allowEdit}
              alwayShowUploadBtn
              type="primary"
              maximumUpload={1}
              onImageChange={onBannerChange}
              itemRender={() => {}}
              tooltip={{
                title: t('validBannerFormat'),
                icon: <QuestionCircleOutlined />
              }}
            />
            {props.bannerFile && (
              <div className="mt-5">
                <AuthImage
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  style={{ objectFit: 'contain' }}
                  isAuth={true}
                  src={props.bannerFile}
                  notHaveBorder
                />
              </div>
            )}
          </div>

          <div className="mb-10">
            <MInput
              name="informationSubject"
              label={t('informationTitle')}
              placeholder={t('informationTitle')}
              hasFeedback
              require={true}
              readOnly={!props.allowEdit}
              noLabel
              noPadding
            />
          </div>

          <div className="mb-10">
            <MCKEditor
              name="details"
              noLabel
              noPadding
              require={true}
              disabled={!props.allowEdit}
              label={t('insurancePackageDetail')}
              value={details}
              onChange={onDetailsChange}
            />
          </div>
        </LayoutForm>
      ) : (
        <Form
          {...ANT_FORM_SEP_LABEL_LAYOUT}
          scrollToFirstError={{
            behavior: 'smooth',
            block: 'center',
            inline: 'center',
            scrollMode: 'always'
          }}
          form={form}
          onFinish={onFinish}>
          <LayoutForm title={t('generalInfo')} description={t('')}>
            <div className="mb-10">
              <MInput
                name="name"
                label={t('insurancePackageName')}
                placeholder={t('insurancePackageName')}
                hasFeedback
                require={true}
                readOnly={!props.allowEdit}
                noLabel
                noPadding
              />
            </div>

            <div className="mb-10">
              <MSelect
                name="packageType"
                label={t('insurancePackageType')}
                placeholder={t('insurancePackageType')}
                hasFeedback
                require={true}
                noLabel
                noPadding
                searchCorrectly={false}
                disabled={!props.allowEdit}
                options={Object.keys(INSURANCE_PACKAGE_TYPE).map((type) => {
                  return {
                    value: type,
                    label: t(type)
                  };
                })}
              />
            </div>

            <div className="mb-10">
              <MUploadImageCropWithBtn
                name="banner"
                label={t('banner')}
                helperText={t('helperUploadPromotion')}
                accept={ACCEPT_IMAGE_UPLOAD}
                noLabel
                noPadding
                aspect={3 / 1}
                require={true}
                disabled={!props.allowEdit}
                alwayShowUploadBtn
                type="primary"
                maximumUpload={1}
                onImageChange={onBannerChange}
                itemRender={() => {}}
                tooltip={{
                  title: t('validBannerFormat'),
                  icon: <QuestionCircleOutlined />
                }}
              />
              {bannerFile && (
                <div className="mt-5">
                  <AuthImage
                    preview={{
                      mask: <EyeOutlined />
                    }}
                    style={{ objectFit: 'contain' }}
                    isAuth={true}
                    src={bannerFile}
                    notHaveBorder
                  />
                </div>
              )}
            </div>

            <div className="mb-10">
              <MInput
                name="informationSubject"
                label={t('informationTitle')}
                placeholder={t('informationTitle')}
                hasFeedback
                require={true}
                readOnly={!props.allowEdit}
                noLabel
                noPadding
              />
            </div>

            <div className="mb-10">
              <MCKEditor
                name="details"
                noLabel
                noPadding
                require={true}
                disabled={!props.allowEdit}
                label={t('insurancePackageDetail')}
                value={details}
                onChange={onDetailsChange}
              />
            </div>
          </LayoutForm>

          {props.allowEdit && (
            <>
              <Divider />

              <div className="d-flex justify-content-center align-item-center">
                <NextBtn htmlType="submit" />
              </div>
            </>
          )}
        </Form>
      )}
    </>
  );
};

export default InsurancePackageStep1;
