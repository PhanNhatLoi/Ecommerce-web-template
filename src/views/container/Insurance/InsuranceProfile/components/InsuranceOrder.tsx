import { Form } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';
import { useWindowSize } from 'react-use';
import Divider from '~/views/presentation/divider';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type InsuranceOrderProps = {};

const InsuranceOrder: React.FC<InsuranceOrderProps> = (props) => {
  const { t }: any = useTranslation();
  const { width } = useWindowSize();
  const params = useParams();
  const history = useHistory();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  useEffect(() => {}, []);

  const InfoItem = ({ label, value }) => {
    return (
      <div className="row mb-5">
        <div className="col-5">
          <ATypography>{label}</ATypography>
        </div>
        <div className="col-1"></div>
        <div className="col-6 text-right">
          <ATypography strong>{value}</ATypography>
        </div>
      </div>
    );
  };

  const infoList = {
    customer: [
      { label: t('fullName'), value: 'Công ty CP eCarAid' },
      { label: t('licensePlate2'), value: '51G-77777' },
      { label: t('chassisNumber'), value: 123123 }
    ],
    scope: [
      { label: t('insurancePeriod'), value: '1/1/2023 - 1/1/2024' },
      { label: t('Fee'), value: numberFormatDecimal(1000000000, ' đ', '') },
      { label: t('tax'), value: numberFormatDecimal(100000000, ' đ', '') },
      { label: t('total_fee'), value: numberFormatDecimal(1100000000, ' đ', '') }
    ]
  };

  return (
    <div className="mt-10">
      <LayoutForm title={t('customer_info')} description={t('')}>
        {infoList.customer.map((bill) => (
          <InfoItem label={bill.label} value={bill.value} />
        ))}
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('insuranceScope')} description={t('')}>
        {infoList.scope.map((bill) => (
          <InfoItem label={bill.label} value={bill.value} />
        ))}
      </LayoutForm>

      <Divider />

      <LayoutForm title={t('promotion')} description={t('')}>
        <div className="row mb-5">
          <div className="col-5">
            <ATypography>{t('voucher')}</ATypography>
          </div>
          <div className="col-4"></div>
          <div className="col-3">
            <MSelect
              name="couponCode"
              className="w-100"
              label=""
              placeholder={t('voucher')}
              noPadding
              noLabel
              require={false}
              allowClear
              searchCorrectly={false}
              // disabled={props.viewPage || props.notAllowEditInfo || props.orderCreateOnApp}
              // options={(props.couponCodeList || []).map((o: any) => {
              //   return {
              //     value: o.couponCode,
              //     search: o.couponCode,
              //     label: o.couponCode
              //   };
              // })}
            />
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-5">
            <ATypography>{t('discountFee')}</ATypography>
          </div>
          <div className="col-1"></div>
          <div className="col-6 text-right">
            <ATypography type="danger">- {numberFormatDecimal(500000, ' đ', '')}</ATypography>
          </div>
        </div>

        <div className="row mb-5">
          <div className="col-5">
            <ATypography strong>{t('totalPrice')}</ATypography>
          </div>
          <div className="col-1"></div>
          <div className="col-6 text-right">
            <ATypography strong>{numberFormatDecimal(1800000, ' đ', '')}</ATypography>
          </div>
        </div>
      </LayoutForm>
    </div>
  );
};

export default connect(null, {})(InsuranceOrder);
