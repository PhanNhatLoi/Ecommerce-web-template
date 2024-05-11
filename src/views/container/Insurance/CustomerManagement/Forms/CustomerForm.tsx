import { Col, Form, FormInstance, Input, Row } from 'antd/es';
import { UploadFile } from 'antd/lib/upload/interface';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { customerActions } from '~/state/ducks/customer';
import { CustomerDetailResponse } from '~/state/ducks/customer/actions';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import { MUploadImageCrop } from '~/views/presentation/fields/upload';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import { typeValidate } from '~/views/utilities/ant-validation';

type CustomerFormProps = {
  buyerId?: number;
  form: FormInstance<any>;
  isSubmitting?: boolean;
  setDirty?: (value: boolean) => void;
  setAddressId?: (value: number) => void;
  setContactList?: (value: []) => void;
  allowEdit: boolean;
  getCustomerDetail: any;
};

const CustomerForm: React.FC<CustomerFormProps> = (props) => {
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
  const [addressNeedLoad, setAddressNeedLoad] = useState<any>();
  const currencyWatch = Form.useWatch('currency', props.form);

  useEffect(() => {
    // set default phone code for VN +84
    props.form.setFieldsValue({ code: 241 });
  }, []);

  useEffect(() => {
    if (props?.buyerId || params?.id) {
      setLoading(true);
      props
        .getCustomerDetail(props?.buyerId || params?.id)
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
          props.setAddressId && props.setAddressId(address?.id);
          // for file upload
          setAvatarFile(response?.avatar);
          setContractFiles(response?.otherData?.contractFiles);
          setImageFiles(response?.otherData?.otherImages);
          setDocumentFiles(response?.otherData?.otherDocuments);
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: CustomerForm.tsx: 98 ~ useEffect ~ err', err);
        });
    } else props.form.setFieldValue('currency', PRICING_UNIT.DONG);
  }, []);

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
    props.setDirty && props.setDirty(Boolean(file));
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
      disabled={!props.allowEdit}
    />
  );

  return (
    <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-2">
      <ASpinner spinning={loading}>
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
                disabled={!props.allowEdit}
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
                <Input allowClear size="large" placeholder={t('Email')} readOnly={!props.allowEdit} />
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
                disabled={!props.allowEdit}
              />
            </Col>
          </Row>
        </LayoutForm>
      </ASpinner>

      {props.allowEdit && (
        <>
          <Divider />

          <Col xs={24} sm={24} md={24} lg={24} xl={24} className="d-flex flex-wrap justify-content-center align-item-center">
            <Row>
              <BackBtn onClick={() => history.push(PATH.INSURANCE_CUSTOMER_LIST_PATH)} />
              <ResetBtn
                onClick={() => {
                  props.form.resetFields();
                  props.setContactList && props.setContactList([]);
                  setAvatarFile('');
                  setContractFiles([]);
                  setImageFiles([]);
                  setDocumentFiles([]);
                  props.setDirty && props.setDirty(true);
                }}
              />
              <SubmitBtn loading={props?.isSubmitting} onClick={() => form.submit()} />
            </Row>
          </Col>
        </>
      )}
    </Col>
  );
};

export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail
})(CustomerForm);
