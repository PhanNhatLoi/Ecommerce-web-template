import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Checkbox, Col, Descriptions, Skeleton } from 'antd/es';
import { head } from 'lodash-es';
import moment from 'moment';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { PROMOTION_STATUS, renderPromotionStatus } from '~/configs/status/car-accessories/promotionStatus';
import { PROMOTION_TYPE } from '~/configs/type/promotionType';
import { PromotionResponse } from '~/state/ducks/promotion/actions';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AntTable from '~/views/presentation/ui/table/AntTable';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { UtilDate } from '~/views/utilities/helpers';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import { columnsCategory, columnsCoupon, columnsInvoice, columnsProduct } from '../component/Columns';

type columnType = {
  title: React.ReactElement;
  dataIndex: string;
  width: number;
  align: string;
};
export const ViewFormPromotion = (props: {
  data?: PromotionResponse;
  type?: 'INVOICE_DISCOUNT' | 'PRODUCT_DISCOUNT' | 'CATEGORY_DISCOUNT' | 'COUPON_DISCOUNT';
  onCancel: () => void;
}) => {
  const { t }: any = useTranslation();
  const [loading, setloading] = useState<boolean>(true);
  const [unLimitTime, setUnLimitTime] = useState<boolean>(true);
  const [columns, setColumns] = useState<columnType[]>([]);
  const [promotionStatus, setPromotionStatus] = useState('');

  useEffect(() => {
    if (props?.data) {
      let newStatus = props?.data?.status;
      if (newStatus && moment().isAfter(props?.data?.endDate)) {
        newStatus = PROMOTION_STATUS.EXPIRED;
      }
      setPromotionStatus(newStatus);
    }
    setUnLimitTime(new Date(props?.data?.endDate || 0).getFullYear() === 9999 ? true : false);
    setTimeout(() => {
      setloading(false);
    }, 1000);
  }, []);

  useEffect(() => {
    switch (props?.data?.promotionType) {
      case PROMOTION_TYPE.PRODUCT_DISCOUNT:
        setColumns(columnsProduct);
        break;
      case PROMOTION_TYPE.CATEGORY_DISCOUNT:
        setColumns(columnsCategory);
        break;
      case PROMOTION_TYPE.INVOICE_DISCOUNT:
        setColumns(columnsInvoice);
        break;
      case PROMOTION_TYPE.COUPON_DISCOUNT:
        setColumns(columnsCoupon);
        break;

      default:
        break;
    }
  }, [props?.data?.promotionType]);

  const DescriptionItem = (props) => {
    return (
      <AlignedDescription
        contentStyle={{ fontWeight: '500' }}
        column={1}
        labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '200px', verticalAlign: 'top' }}
        colon={false}
        layout={props.layout}
        bordered>
        <Descriptions.Item className="p-2" label={props.label} contentStyle={{ fontSize: 13 }}>
          {props.hasImage ? (
            props.content ? (
              <AuthImage
                preview={{
                  mask: <EyeOutlined />
                }}
                style={{ objectFit: 'contain' }}
                containerClassName="d-flex align-items-center justify-content-start"
                notHaveBorder
                isAuth={true}
                src={props.content}
              />
            ) : (
              t('no_data')
            )
          ) : (
            props.content
          )}
        </Descriptions.Item>
      </AlignedDescription>
    );
  };

  return (
    <Skeleton loading={loading} active style={{ height: 400 }}>
      <LayoutForm title={t('description_promotion')}>
        <Col>
          <div>
            <DescriptionItem content={props?.data?.name} label={t('promotionName')} layout />
            <DescriptionItem content={props?.data?.content || t('no_data')} label={t('description')} layout />
            <DescriptionItem content={props?.data?.code || t('no_data')} label={t('promotion_code')} layout />
            <DescriptionItem content={props?.data?.quantityUsed || 0} label={t('number_applied')} layout />
            <DescriptionItem
              content={props?.data && renderPromotionStatus(PROMOTION_STATUS[promotionStatus], t(PROMOTION_STATUS[promotionStatus]), 'tag')}
              label={t('status')}
              layout
            />
            <DescriptionItem content={firstImage(head(props?.data?.images)?.url)} label={t('banner')} layout hasImage />
          </div>
        </Col>
      </LayoutForm>
      <Divider />
      <LayoutForm title={t('apply_time_promotion')}>
        <DescriptionItem content={UtilDate.toDateTimeLocal(props?.data?.createdDate)} label={t('create_day')} layout />
        <DescriptionItem
          content={
            unLimitTime ? (
              <div>
                {`${UtilDate.toDateTimeLocal(props?.data?.startDate)}`}
                <Checkbox className="ml-2" disabled checked={true} />
                {t('unlimited')}
              </div>
            ) : (
              <div>
                {`${UtilDate.toDateTimeLocal(props?.data?.startDate)} - 
                  ${UtilDate.toDateTimeLocal(props?.data?.endDate)}`}
              </div>
            )
          }
          label={t('apply_time')}
          layout
        />
      </LayoutForm>
      <Divider />
      <div>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          {t(props?.data?.promotionType || '-')}
        </ATypography>
        <AntTable
          columns={columns}
          loading={loading}
          data={
            props?.data?.promotionType === PROMOTION_TYPE.PRODUCT_DISCOUNT
              ? props?.data?.tradingProducts
              : props?.data?.promotionType === PROMOTION_TYPE.CATEGORY_DISCOUNT
              ? props?.data?.categories
              : props?.data?.promotionType === PROMOTION_TYPE.INVOICE_DISCOUNT
              ? props?.data?.invoiceDiscounts
              : props?.data?.promotionType === PROMOTION_TYPE.COUPON_DISCOUNT
              ? props?.data?.coupons
              : []
          }
        />
      </div>
      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <AButton
          style={{ verticalAlign: 'middle', width: '200px' }}
          className="mt-3 mt-lg-0 ml-lg-3 px-5"
          size="large"
          type="ghost"
          onClick={props.onCancel}
          icon={<CloseOutlined />}>
          {t('close')}
        </AButton>
      </div>
    </Skeleton>
  );
};

export default connect(null, {})(ViewFormPromotion);
