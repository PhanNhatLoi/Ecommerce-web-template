import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';

import { PAYMENT_GATEWAY } from '~/configs/const';
import { orderActions } from '~/state/ducks/carAccessories/order';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { formatPhoneWithCountryCode } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const AvatarContainerStyle = styled.div`
  with: 50px;
  height: 50px;
  @media print {
    with: 100px;
    height: 100px;
  }
`;

type PrintFormProps = { orderId: any; getOrderDetail: any };

export const PrintForm: React.FC<PrintFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [orderData, setOrderData] = useState<any>({});
  const [shippingAddress, setShippingAddress] = useState<any>('');

  useEffect(() => {
    props
      .getOrderDetail(props?.orderId)
      .then((res) => {
        const shippingAddress = res?.content?.shippingAddress;
        const fullShippingAddress = `${shippingAddress?.address || ''} ${shippingAddress?.fullAddress || ''}, ${
          shippingAddress?.wards?.name || ''
        }, ${shippingAddress?.district?.name || ''}, ${shippingAddress?.province?.name || ''} ${shippingAddress?.zipCode || ''}, ${
          shippingAddress?.country?.nativeName || ''
        }`;
        setShippingAddress(
          fullShippingAddress
            .split(',')
            .map((segment) => segment.trim())
            .join(', ')
        );
        setOrderData(res?.content);
      })
      .catch((err) => console.error(err));
  }, []);

  return (
    <div className="print-form">
      <div className="row mb-10">
        <AvatarContainerStyle className="col-6 d-flex justify-content-center align-self-center">
          {orderData?.sellerInfoCache?.avatar && (
            <AuthAvatar className="w-auto h-auto mr-5" isAuth src={firstImage(orderData?.sellerInfoCache?.avatar)} />
          )}
        </AvatarContainerStyle>

        <div className="print-title col-6">
          <div>{`${t('shipCode')}: ${orderData?.shippingCode || ''}`}</div>
          <div>{`${t('orderId')}: ${orderData?.code || ''}`}</div>
          <div>{`${t('order_date')}: ${UtilDate.toDateTimeLocal(orderData?.audit?.createdDate) || ''}`}</div>
        </div>
      </div>
      <div className="row mb-10">
        <div className="print-shipping col-6">
          <div className="p-4" style={{ border: '1px solid', height: '100%' }}>
            <div className="font-weight-bold">{`${t('delivery_from')}:`}</div>
            <div>{`${t('name')}: ${orderData?.sellerInfoCache?.fullName || ''}`}</div>
            <div>{`${t('address')}: ${orderData?.sellerInfoCache?.address?.fullAddress || ''}`}</div>
            <div>{`${t('short_phone_number')}: ${
              orderData?.sellerInfoCache?.phone
                ? formatPhoneWithCountryCode(
                    orderData?.sellerInfoCache?.phone,
                    orderData?.sellerInfoCache?.phone?.startsWith('84')
                      ? 'VN'
                      : orderData?.sellerInfoCache?.phone?.startsWith('1')
                      ? 'US'
                      : 'VN'
                  )
                : ''
            }`}</div>
          </div>
        </div>
        <div className="print-shipping col-6">
          <div className="p-4" style={{ border: '1px solid', height: '100%' }}>
            <div className="font-weight-bold">{`${t('delivery_to')}:`}</div>
            <div>{`${t('name')}: ${orderData?.shippingAddress?.fullName || ''}`}</div>
            <div>{`${t('address')}: ${shippingAddress || ''}`}</div>
            <div>{`${t('short_phone_number')}: ${
              orderData?.shippingAddress?.phone
                ? formatPhoneWithCountryCode(
                    orderData?.shippingAddress?.phone,
                    orderData?.shippingAddress?.phone?.startsWith('84')
                      ? 'VN'
                      : orderData?.shippingAddress?.phone?.startsWith('1')
                      ? 'US'
                      : 'VN'
                  )
                : ''
            }`}</div>
          </div>
        </div>
      </div>
      <div className="row mb-15">
        <div className="print-product col-12">
          <div style={{ height: '100%' }}>
            <div className="font-weight-bold">{`${t('product_content')} (${t('total_product_quantity')}: ${
              orderData?.orderDetails?.length
            })`}</div>
            <div>
              {orderData?.orderDetails?.map((order, i) => (
                <p>{`${++i}. ${order?.productName || ''}, ${t('short_quantity')}: ${order?.quantity || ''}`}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div className="row">
        <div className="print-total col-6">
          <div className="print-total-title text-center">{`${t('amount_due')}:`}</div>
          <h2 className="print-total-amount font-weight-bold p-10 text-center">
            {orderData?.paymentGateway === PAYMENT_GATEWAY.CASH ? numberFormatDecimal(orderData?.total || 0, ' VND', '') : `0 VND`}
          </h2>
        </div>
        <div className="print-total col-6">
          <div className="print-total-title font-weight-bold text-center">{t('receiver_signature')}</div>
          <div className="print-total-confirm text-center">{t('confirm_sign')}</div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, {
  getOrderDetail: orderActions.getOrderDetail
})(PrintForm);
