import { Col, Form, Row } from 'antd/es';
import { FormInstance } from 'antd/es/form/Form';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { customerActions } from '~/state/ducks/customer';
import Divider from '~/views/presentation/divider';
import { MInput, MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { phoneValidate } from '~/views/utilities/ant-validation';

import { AddressNeedLoadType, Customer, CustomerInfoOrderDetail } from '../Types';

type CustomerInfoProps = {
  form: FormInstance;
  viewPage: Boolean;
  isUpdatePage: () => Boolean;
  isViewPage: () => Boolean;
  notAllowEditInfo: Boolean;
  customerList: Customer[] | undefined;
  addressNeedLoad: AddressNeedLoadType | undefined;

  orderCreateOnApp: Boolean;
  customerInfoByProfileId: Customer | undefined;
  customerInfoByOrderDetail: CustomerInfoOrderDetail | undefined;

  fetchAndSetCustomerInfo: (profileId: String) => void;
  setRefeshCustomer: React.Dispatch<React.SetStateAction<boolean>>;
  setAddressNeedLoad: React.Dispatch<React.SetStateAction<AddressNeedLoadType | undefined>>;
};
const CustomerInfo: React.FC<CustomerInfoProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  useEffect(() => {
    props?.form.setFieldsValue({
      code: 241
    });
  }, []);

  function fillAddressInForm(addressInfo) {
    const addressName = `${addressInfo?.address || ''} ${addressInfo?.fullAddress || ''}`.trim();

    props.form.setFieldsValue({
      code: addressInfo.country?.id || 241,
      address1: addressName,

      state: addressInfo.address?.stateId, //thường là null
      zipCode: addressInfo.address?.zipCode, //thường là null

      country1: addressInfo.address?.countryId || addressInfo?.countryId || addressInfo.country?.id,
      province: addressInfo.address?.provinceId || addressInfo.provinceId || addressInfo?.province?.id,
      district: addressInfo.address?.districtId || addressInfo.districtId || addressInfo?.district?.id,
      ward: addressInfo.address?.wardsId || addressInfo.wardsId || addressInfo?.wards?.id
    });
    props.setAddressNeedLoad({
      state: addressInfo.address?.stateId,

      country: addressInfo.address?.countryId || addressInfo?.countryId || addressInfo.country?.id,
      province: addressInfo.address?.provinceId || addressInfo.provinceId || addressInfo?.province?.id,
      district: addressInfo.address?.districtId || addressInfo.districtId || addressInfo?.district?.id,
      ward: addressInfo.address?.wardsId || addressInfo.wardsId || addressInfo?.wards?.id
    });
  }

  //for create sale order page
  useEffect(() => {
    const info = props.customerInfoByProfileId;
    const addressInfo = info?.address;

    if (info && !props.isUpdatePage() && !props.isViewPage()) {
      props?.form.setFieldsValue({
        customerId: info?.id,
        email: info.email,
        phone: info.phone
      });

      addressInfo && fillAddressInForm(addressInfo);
    }
  }, [props.customerInfoByProfileId]);

  //for sale order update page or for view page
  useEffect(() => {
    if (props.isUpdatePage() || props.isViewPage()) {
      const customerInfo = props.customerInfoByOrderDetail;
      const addressInfo = customerInfo?.addressInfo;
      addressInfo && fillAddressInForm(addressInfo);

      if (props.orderCreateOnApp) {
        props.form.setFieldsValue({
          customerName: customerInfo?.customerName,
          customerId: customerInfo?.buyerProfileId.toString(),
          phone: addressInfo?.phone
        });
      } else {
        const customerProfile = props.customerInfoByProfileId;
        props?.form.setFieldsValue({
          customerId: customerProfile?.id,
          email: customerProfile?.email,
          phone: addressInfo?.phone
        });
      }
    }
  }, [props.customerInfoByProfileId, props.customerInfoByOrderDetail]);

  return (
    <Col xs={24} sm={24} md={24} lg={24}>
      <LayoutForm title={t('customer_info')} description={t('customer_info_des')}>
        {/* Mã khách hàng+tên khách hàng */}
        {props.orderCreateOnApp ? (
          <Row>
            <Col xs={24} sm={24} md={24} lg={24}>
              <MInput //
                label={t('customer_name')}
                allowClear
                disabled={true}
                labelAlign="left"
                require
                customLayout="w-100"
                noPadding
                name="customerName"
                loading={!props.customerList}
                placeholder={t('customer_search_by_code')}
              />
              <MInput //
                label={t('customer_code')}
                allowClear
                disabled={true}
                labelAlign="left"
                require
                customLayout="w-100 d-none"
                noPadding
                name="customerId"
                loading={!props.customerList}
                placeholder={t('customer_search_by_code')}
              />
            </Col>
          </Row>
        ) : (
          <Row>
            <Col xs={24} sm={24} md={11} lg={11}>
              <MSelect //
                label={t('customer_code')}
                allowClear
                disabled={props.viewPage || props.notAllowEditInfo || props.isUpdatePage()}
                labelAlign="left"
                require
                customLayout="w-100"
                noPadding
                name="customerId"
                loading={!props.customerList}
                onChange={props.fetchAndSetCustomerInfo}
                onClick={() => props.setRefeshCustomer(true)}
                options={props.customerList?.map((customer: Customer) => {
                  return {
                    value: customer.profileId,
                    label: customer.code
                  };
                })}
                placeholder={t('customer_search_by_code')}
              />
            </Col>
            <Col xs={24} sm={24} md={2} lg={2} />
            <Col xs={24} sm={24} md={11} lg={11}>
              <MSelect //
                label={t('customer_name')}
                allowClear
                disabled={props.viewPage || props.notAllowEditInfo || props.isUpdatePage()}
                labelAlign="left"
                require
                onChange={props.fetchAndSetCustomerInfo}
                onClick={() => props.setRefeshCustomer(true)}
                customLayout="w-100"
                noPadding
                name="customerId"
                loading={!props.customerList}
                options={props.customerList?.map((customer: Customer) => {
                  return {
                    value: customer.profileId,
                    label: customer.fullname
                  };
                })}
                placeholder={t('customer_search_by_name')}
              />
            </Col>
          </Row>
        )}

        {/* Sđt+email */}
        <Row>
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputPhone
              noLabel
              disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
              noPadding
              label={t('phone_number')}
              placeholder={t('enter_phone_numbers')}
              name="phone"
              mRules={phoneValidate()}
              require
              phoneTextTranslate="1px"
              tooltip={{
                title: t('required_field'),
                icon: (
                  <span>
                    (<ATypography type="danger">*</ATypography>)
                  </span>
                )
              }}
            />
          </Col>

          <Col xs={24} sm={24} md={2} lg={2} />
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInput
              noLabel
              disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
              noPadding
              require={false}
              label={t('email_address')}
              placeholder={t('enter_email')}
              name="email"
              type="email"
            />
          </Col>
        </Row>
      </LayoutForm>
      <Divider />
      <LayoutForm data-aos="fade-right" data-aos-delay="300" title={t('address')} description={t('address_inf')}>
        {/* địa chỉ giao hàng */}
        <Row>
          <Col xs={24} sm={24} md={24} lg={24}>
            <MInputAddress //
              form={props.form}
              disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
              hasRegisterLayout
              label={t('order_address')}
              name="addressInfo"
              needLoadData={props.addressNeedLoad}
              noLabel
              noPadding
              require={true}
              setNeedLoadData={props.setAddressNeedLoad}
            />
          </Col>
        </Row>
      </LayoutForm>
    </Col>
  );
};

export default connect(null, {
  getCustomers: customerActions.getCustomers,
  getCustomerDetail: customerActions.getCustomerDetail
})(CustomerInfo);
