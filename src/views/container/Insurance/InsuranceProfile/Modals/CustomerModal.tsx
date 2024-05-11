import { EyeOutlined } from '@ant-design/icons';
import { Col, Form, Input, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import * as PATH from '~/configs/routesConfig';
import { customerActions } from '~/state/ducks/customer';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import AntModal from '~/views/presentation/ui/modal/AntModal';
import { typeValidate } from '~/views/utilities/ant-validation';
import { firstImage } from '~/views/utilities/helpers/utilObject';

type CustomerModalProps = {
  customerId: number;
  modalShow: boolean;
  setModalShow: React.Dispatch<React.SetStateAction<boolean>>;
  getCustomerDetail: any;
};

export const CustomerModal: React.FC<CustomerModalProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const { width } = useWindowSize();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const avatarWatch = Form.useWatch('avatar', form);
  const [addressNeedLoad, setAddressNeedLoad] = useState<any>();

  useEffect(() => {
    if (props.customerId) {
      setLoading(true);
      props
        .getCustomerDetail(props.customerId)
        .then((res: any) => {
          const response = res?.content;
          form.setFieldsValue({
            fullName: response?.fullName,
            code: response?.country?.id,
            phone: response?.phone,
            email: response?.email,
            avatar: response?.avatar,
            // address
            country1: response?.address?.countryId,
            address1: response?.address?.address,
            state: response?.address?.stateId,
            zipCode: response?.address?.zipCode,
            province: response?.address?.provinceId,
            district: response?.address?.districtId,
            ward: response?.address?.wardsId
          });
          setAddressNeedLoad({
            country: response?.address?.countryId,
            state: response?.address?.stateId,
            province: response?.address?.provinceId,
            district: response?.address?.districtId,
            ward: response?.address?.wardsId
          });
          setLoading(false);
        })
        .catch((err: any) => {
          console.error('chiendev ~ file: ViewForm.tsx: 92 ~ useEffect ~ err', err);
          setLoading(false);
        });
    }
  }, [props.customerId]);

  const NameField = (
    <MInput noLabel noPadding label={t('customer_name')} name="fullName" placeholder={t('')} readOnly hasFeedback={false} require={false} />
  );

  const AvatarField = (
    <Form.Item name="avatar">
      <AuthImage
        src={firstImage(avatarWatch)}
        require={false}
        preview={{
          mask: <EyeOutlined />
        }}
        width={90}
        height={90}
        style={{ objectFit: 'cover' }}
        isAuth={true}
      />
    </Form.Item>
  );

  const handleCancel = () => {
    props.setModalShow(false);
  };

  return (
    <HOC>
      <AntModal
        title={t('insurancePackageDetail')}
        description={''}
        width={1000}
        destroyOnClose
        modalShow={props.modalShow}
        setModalShow={props.setModalShow}
        onCancel={handleCancel}>
        <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form}>
          <ASpinner spinning={loading}>
            <Row className="mt-2">
              <LayoutForm data-aos="fade-right" title={t('customer_info')} description={t('customer_info_des')}>
                <Col md={24} lg={20}>
                  <Row>
                    <Col md={24} lg={12}>
                      {width < 992 ? AvatarField : NameField}
                    </Col>
                    <Col md={24} lg={4} />
                    <Col md={24} lg={8}>
                      {width < 992 ? NameField : AvatarField}
                    </Col>

                    <Col md={24} lg={24} xl={12} className="mt-2 w-100">
                      <MInputPhone
                        noLabel
                        noPadding
                        phoneTextTranslate="1px"
                        label={t('phone')}
                        placeholder={t('')}
                        name="phone"
                        disabled
                        hasFeedback={false}
                        require={false}
                      />
                    </Col>
                    <Col md={24} lg={24} xl={1}></Col>
                    <Col md={24} lg={24} xl={11} className="mt-2 w-100">
                      <Form.Item //
                        hasFeedback
                        label={t('Email').toString()}
                        name="email"
                        validateFirst
                        rules={typeValidate('email') as any}>
                        <Input allowClear size="large" placeholder={t('')} readOnly />
                      </Form.Item>
                    </Col>

                    <Col className="mt-4 w-100">
                      <MInputAddress
                        form={form}
                        label={t('address')}
                        name="addressInfo"
                        needLoadData={addressNeedLoad}
                        noLabel
                        noPadding
                        disabled
                        hasFeedback={false}
                        require={false}
                        hasRegisterLayout
                        codeInputStyle={{ paddingTop: '0.5px' }}
                        setNeedLoadData={setAddressNeedLoad}
                      />
                    </Col>
                  </Row>
                </Col>
              </LayoutForm>

              <Divider />

              <Col className="d-flex flex-wrap justify-content-center align-item-center">
                <Row>
                  <BackBtn onClick={() => history.push(PATH.INSURANCE_CUSTOMER_LIST_PATH)} />
                </Row>
              </Col>
            </Row>
          </ASpinner>
        </Form>
      </AntModal>
    </HOC>
  );
};
export default connect(null, {
  getCustomerDetail: customerActions.getCustomerDetail
})(CustomerModal);
