import { Col, Form, FormInstance, Input, Radio, Row } from 'antd/es';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import { MAX_IMAGE_NUMBER } from '~/configs/const';
import * as PATH from '~/configs/routesConfig';
import { PRICING_STEP, PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { ACCEPT_FILE_UPLOAD } from '~/configs/upload';
import { customerActions } from '~/state/ducks/customer';
import { CustomerDetailResponse } from '~/state/ducks/customer/actions';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone, MInputTime } from '~/views/presentation/fields/input';
import { MUploadDocument, MUploadImageCrop, MUploadImageNoCropMultiple } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { typeValidate } from '~/views/utilities/ant-validation';

import { MInputNumberStyled } from '../components/Styles';
import { AddressNeedLoadType } from '../components/Types';
import MRadio from '~/views/presentation/fields/Radio';

type InfoFormProps = {
  form: FormInstance<any>;
  getCustomerDetail: any;
  isSubmitting: boolean;
  setDirty: (value: boolean) => void;
  setAddressId: (value: number) => void;
  setContactList: (value: []) => void;
};

const InfoForm: React.FC<InfoFormProps> = (props) => {
  const { t }: any = useTranslation();
  const { width } = useWindowSize();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const [avatarFile, setAvatarFile] = useState<string>('');
  const [contractFiles, setContractFiles] = useState<UploadFile[]>([]);
  const [imageFiles, setImageFiles] = useState<string[]>([]);
  const [documentFiles, setDocumentFiles] = useState<UploadFile[]>([]);
  const [addressNeedLoad, setAddressNeedLoad] = useState<AddressNeedLoadType>();
  const currencyWatch = Form.useWatch('currency', props.form);

  useEffect(() => {
    // set default phone code for VN +84
    props.form.setFieldsValue({ code: 241 });
  }, []);

  useEffect(() => {
    if (params?.profileId) {
      setLoading(true);
      props
        .getCustomerDetail(params?.profileId)
        .then((res: { content: CustomerDetailResponse }) => {
          const response = res?.content;
          const address = response?.address;
          const addressName = `${address?.address} ${address?.fullAddress}`.trim();

          props.form.setFieldsValue({
            fullName: response?.fullName,
            code: response?.country?.id,
            phone: response?.phone,
            email: response?.email || undefined,
            avatar: response?.avatar,
            // address
            country1: address?.countryId,
            address1: addressName,
            state: address?.stateId,
            zipCode: address?.zipCode || undefined,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId,
            // other data
            debtMaximum: response?.otherData?.debtMaximum,
            currency: response?.otherData?.currency,
            timeNumber: response?.otherData?.timeDate,
            time: response?.otherData?.time,
            digitalContract: response?.otherData?.digitalContract,
            contractFiles: response?.otherData?.contractFiles,
            otherDocuments: response?.otherData?.otherDocuments,
            otherImages: response?.otherData?.otherImages
          });
          setAddressNeedLoad({
            country: address?.countryId,
            state: address?.stateId,
            province: address?.provinceId,
            district: address?.districtId,
            ward: address?.wardsId
          });
          props.setAddressId(address?.id);
          // for file upload
          setAvatarFile(response?.avatar);
          setContractFiles(response?.otherData?.contractFiles);
          setImageFiles(response?.otherData?.otherImages);
          setDocumentFiles(response?.otherData?.otherDocuments);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: InfoForm.tsx: 98 ~ useEffect ~ err', err);
        });
    } else props.form.setFieldValue('currency', PRICING_UNIT.DONG);
  }, [params?.profileId]);

  const NameField = (
    <MInput //
      noLabel
      noPadding
      label={t('customer_name')}
      name="fullName"
      placeholder={t('customer_name')}
      hasFeedback
      loading={loading}
    />
  );

  const onAvatarChange = (file: string) => {
    props.setDirty(Boolean(file));
    setAvatarFile(file);
    props.form.setFieldsValue({ avatar: file });
  };
  const AvatarField = (
    <MUploadImageCrop //
      name="avatar"
      noLabel
      noPadding
      aspect={1}
      uploadText={t('upload_logo_avatar')}
      file={avatarFile}
      onImageChange={onAvatarChange}
      require={false}
    />
  );

  const onContractChange = (file: UploadFile[]) => {
    props.setDirty(Boolean(file));
    props.form.setFieldsValue({ contractFiles: file });
  };

  const onDocumentChange = (file: UploadFile[]) => {
    props.setDirty(Boolean(file));
    props.form.setFieldsValue({
      otherDocuments: file.map((item) => {
        return {
          name: item.name,
          url: item.url
        };
      })
    });
  };

  const onImageChange = (file: UploadFile[]) => {
    props.setDirty(Boolean(file));
    props.form.setFieldsValue({
      otherImages: (file || []).map((document) => document?.url)
    });
  };

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
      <LayoutForm title={t('customer_info')} description={t('customer_info_des')}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="w-100">
            {width < 992 ? AvatarField : NameField}
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={5} />
          <Col xs={24} sm={24} md={24} lg={24} xl={8} className="w-100">
            {width < 992 ? NameField : AvatarField}
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="mt-4 w-100">
            <MInputPhone
              noLabel
              noPadding
              phoneTextTranslate="1px"
              label={t('phone_number')}
              placeholder={t('login_phone_number')}
              name="phone"
              hasFeedback
              require
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}></Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="mt-4 w-100">
            <Form.Item //
              hasFeedback
              label={t('Email')}
              name="email"
              validateFirst
              rules={typeValidate('email')}>
              <Input allowClear size="large" placeholder={t('Email')} />
            </Form.Item>
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-4 w-100">
            <MInputAddress //
              form={props.form}
              label={t('address')}
              name="addressInfo"
              needLoadData={addressNeedLoad}
              noLabel
              noPadding
              require={true}
              hasRegisterLayout
              codeInputStyle={{ paddingTop: '0.5px' }}
              setNeedLoadData={setAddressNeedLoad}
            />
          </Col>
        </Row>
      </LayoutForm>

      <Divider />

      <LayoutForm data-aos="fade-right" data-aos-delay="300" title={t('customer_more_info')} description={t('customer_more_info_des')}>
        <Row>
          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="mb-5">
            <MInputNumberStyled
              loading={loading}
              noLabel
              noPadding
              addonAfter={
                <Form.Item name="currency">
                  <MRadio
                    spaceSize={0}
                    label=""
                    options={[
                      { label: 'đ', value: PRICING_UNIT.DONG },
                      { label: '$', value: PRICING_UNIT.DOLLARS }
                    ]}
                    onChange={(e) => props.form.setFieldValue('currency', e.target.value)}
                    value={currencyWatch}
                    defaultValue={PRICING_UNIT.DONG}
                    optionType="button"
                    buttonStyle="solid"
                  />
                </Form.Item>
              }
              step={currencyWatch === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
              label={t('max_allow_debt')}
              placeholder={t('example_debt')}
              name="debtMaximum"
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}></Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="w-100 mb-5">
            <MInputTime
              noLabel
              noPadding
              hasFeedback
              name="timeDate"
              label={t('debt_term')}
              placeholder={t('debt_term')}
              timeTextTranslate="1px"
            />
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="w-100">
            <MInput //
              noLabel
              noPadding
              hasFeedback
              label={t('digital_contract')}
              name="digitalContract"
              placeholder={t('digital_contract')}
              require={false}
              loading={loading}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}></Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11}></Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="mt-8 w-100">
            <MUploadDocument //
              name="contractFiles"
              noPadding
              noLabel
              require={false}
              label={t('upload_contract')}
              fileList={contractFiles}
              onImageChange={onContractChange}
              maxCount={2}
              accept={ACCEPT_FILE_UPLOAD.join(',')}
              required={false}
            />
          </Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={2}></Col>
          <Col xs={24} sm={24} md={24} lg={24} xl={11} className="mt-8 w-100">
            <MUploadDocument //
              name="otherDocuments"
              noLabel
              noPadding
              require={false}
              label={t('customer_other_document')}
              fileList={documentFiles}
              onImageChange={onDocumentChange}
              maxCount={1}
              accept={ACCEPT_FILE_UPLOAD.join(',')}
              required={false}
            />
          </Col>

          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-6 w-100">
            <MUploadImageNoCropMultiple //
              name="otherImages"
              noLabel
              noPadding
              label={t('customer_other_image')}
              fileList={imageFiles}
              onImageChange={onImageChange}
              maximumUpload={MAX_IMAGE_NUMBER}
              maxCount={MAX_IMAGE_NUMBER}
              require={false}
            />
          </Col>
        </Row>
      </LayoutForm>

      <Divider />

      <Col xs={24} sm={24} md={24} lg={24} xl={24} className="d-flex flex-wrap justify-content-center align-item-center">
        <Row>
          <BackBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_CUSTOMER_LIST_PATH)} />
          <ResetBtn
            onClick={() => {
              props.form.resetFields();
              props.setContactList([]);
              setAvatarFile('');
              setContractFiles([]);
              setImageFiles([]);
              setDocumentFiles([]);
              props.setDirty(true);
            }}
          />
          <SubmitBtn loading={props.isSubmitting} onClick={() => form.submit()} />
        </Row>
      </Col>
    </Col>
  );
};

export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail
})(InfoForm);
