import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Descriptions, Skeleton, Steps } from 'antd/es';
import { first } from 'lodash-es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ScrollBar from 'react-perfect-scrollbar';
import { connect } from 'react-redux';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { renderPaymentStatus } from '~/configs/status/transaction/paymentStatus';
import { renderPaymentType } from '~/configs/type/transaction/paymentType';
import { repairActions } from '~/state/ducks/carServices/repair';
import { helpActions } from '~/state/ducks/member/help';
import { paymentActions } from '~/state/ducks/transaction/payment';
import Divider from '~/views/presentation/divider';
import { BasicBtn } from '~/views/presentation/ui/buttons';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { UtilDate } from '~/views/utilities/helpers';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const desStyle = { color: 'rgba(0,0,0,0.8)', fontSize: '12px', textAlign: 'right' };

const StepStyled = styled(Steps)`
  .ant-steps-label-vertical .ant-steps-item-content {
    margin-top: 14px !important;
  }
  height: ${(props) => (props.windowWidth > 768 ? '100px' : 'max-content')};
  position: relative;
  top: 16px;
  overflow-y: ${(props) => (props.windowWidth > 768 ? 'hidden' : 'scroll')};
  overflow-x: ${(props) => (props.windowWidth <= 768 ? 'hidden' : 'scroll')};
  .ant-steps-item {
    position: relative;
    left: ${(props) => (props.windowWidth <= 768 ? '16px' : '0px')};
    top: ${(props) => (props.windowWidth > 768 ? '16px' : '0px')};
  }
`;

const ViewForm = (props) => {
  const { t } = useTranslation();
  const { width, height } = useWindowSize();
  const [paymentDetails, setPaymentDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  //-----------------------------------------
  // FETCH DATA
  //-----------------------------------------
  const fetch = (id, action, setData) => {
    setPageLoading(true);
    action(id)
      .then((res) => {
        setData(res?.content);
        setPageLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
        AMessage.error(t(err.message));
        setPageLoading(false);
      });
  };

  useEffect(() => {
    if (Boolean(props.id)) {
      fetch(props.id, props.getPaymentsDetail, setPaymentDetail);
    }
  }, [props.id]);

  const formatData = (key, value) => {
    switch (key) {
      case 'date':
        return UtilDate.toDateTimeLocal(value);
      case 'amount':
        return numberFormatDecimal(+value, ' đ', '');
      case 'paymentGateway':
        return renderPaymentType(value, t(value), 'tag');
      case 'status':
        return renderPaymentStatus(value, t(value), 'tag');
      case 'media':
        return (
          <AuthImage
            containerClassName="images m-0"
            preview={{
              mask: <EyeOutlined />
            }}
            width={50}
            isAuth={true}
            notHaveBorder
            src={firstImage(first(value)?.url)}
          />
        );
      default:
        return value;
    }
  };

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <AlignedDescription labelStyle={{ padding: '0px' }} contentStyle={{ paddingTop: '0px', paddingBottom: '16px' }}>
          {Object.keys(paymentDetails).map((key, index) => {
            if (key !== 'paymentInfo') {
              return (
                <Descriptions.Item contentStyle={desStyle} className="pt-1" label={t(key)}>
                  {paymentDetails[key] ? formatData(key, paymentDetails[key]) : '-'}
                </Descriptions.Item>
              );
            } else {
              return Object.keys(paymentDetails.paymentInfo).map((key1, index) => {
                return paymentDetails.paymentInfo[key1] ? (
                  <Descriptions.Item contentStyle={desStyle} className="pt-1" label={t(key1)}>
                    {formatData(key1, paymentDetails.paymentInfo[key1]) || '-'}
                  </Descriptions.Item>
                ) : null;
              });
            }
          })}
        </AlignedDescription>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-flex flex-column flex-lg-row align-items-between justify-content-between">
        <BasicBtn size="large" type="ghost" onClick={props.onCancel} icon={<CloseOutlined />} title={props.cancelText || t('close')} />
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getRepairDetail: repairActions.getRepairDetail,
    getHelpWizard: helpActions.getHelpWizard,
    getPaymentsDetail: paymentActions.getPaymentsDetail
  }
)(ViewForm);
