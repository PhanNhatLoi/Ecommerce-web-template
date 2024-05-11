import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { pricingSystemActions } from '~/state/ducks/mechanic/pricingSystem';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const { TabPane } = Tabs;

const ViewForm = (props) => {
  const { t } = useTranslation();
  const [productDetail, setProductDetail] = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getPricingProductDetail(props.id)
        .then((res) => {
          setProductDetail(res?.content);
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  const handleGetWarranty = (value) => {
    if (value?.guaranteeTime) return { label: t('warrantyTime'), data: `${value?.guaranteeTime} ${t('month')}` };
    else if (value?.guaranteeKm) return { label: t('warrantyKm'), data: `${value?.guaranteeKm} km` };
    else return { label: t('warrantyPolicy'), data: t('noWarranty') };
  };

  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col lg={15} md={24}>
            <AlignedDescription
              contentStyle={{ fontWeight: '500' }}
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
              colon={false}
              bordered>
              <Descriptions.Item className="pb-0" label={t('product/service_name')} contentStyle={{ fontSize: '12px' }}>
                {productDetail?.name}
              </Descriptions.Item>
              <Descriptions.Item className="pb-0" label={t('product/service_code')} contentStyle={{ fontSize: '12px' }}>
                {productDetail?.code}
              </Descriptions.Item>
            </AlignedDescription>

            <AlignedDescription
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: 'max-content', verticalAlign: 'top' }}
              contentStyle={{ display: 'flex', fontWeight: '500', alignItems: 'flex-start', padding: '0px' }}
              colon={false}
              layout="vertical"
              bordered>
              <Descriptions.Item className="pb-0" label={t('product_or_service_details')} contentStyle={{ fontSize: '12px' }}>
                <div dangerouslySetInnerHTML={{ __html: productDetail?.description }} />
              </Descriptions.Item>
            </AlignedDescription>

            <Tabs defaultActiveKey="1" type="card" className="mt-5">
              <TabPane tab={t('general')} key="1">
                <AlignedDescription
                  contentStyle={{ fontWeight: '500' }}
                  column={1}
                  labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
                  colon={false}
                  bordered>
                  <Descriptions.Item className="pb-0" label={t('regularPrice')} contentStyle={{ fontSize: '12px' }}>
                    {numberFormatDecimal(+productDetail?.price, ' đ', '')}
                  </Descriptions.Item>
                  <Descriptions.Item className="pb-0" label={t('salePrice')} contentStyle={{ fontSize: '12px' }}>
                    {numberFormatDecimal(+productDetail?.salePrice, ' đ', '')}
                  </Descriptions.Item>
                </AlignedDescription>
              </TabPane>
              <TabPane tab={t('detail')} key="2">
                <AlignedDescription
                  contentStyle={{ fontWeight: '500' }}
                  column={1}
                  labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
                  colon={false}
                  bordered>
                  <Descriptions.Item className="pb-0" label={t('origin')} contentStyle={{ fontSize: '12px' }}>
                    {productDetail?.origin || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item className="pb-0" label={t('unit')} contentStyle={{ fontSize: '12px' }}>
                    {productDetail?.unit || '-'}
                  </Descriptions.Item>
                  <Descriptions.Item
                    className="pb-0"
                    label={handleGetWarranty(productDetail?.warrantyPolicy).label}
                    contentStyle={{ fontSize: '12px' }}>
                    {handleGetWarranty(productDetail?.warrantyPolicy).data}
                  </Descriptions.Item>
                </AlignedDescription>
              </TabPane>
            </Tabs>
          </Col>

          <Col lg={2} md={24}></Col>

          <Col lg={7} md={24}>
            <AuthImage
              preview={{
                mask: <EyeOutlined />
              }}
              width={200}
              isAuth={true}
              src={firstImage(productDetail?.image)}
              // onClick={(e) => e.stopPropagation()}
            />
          </Col>
        </Row>
      </Skeleton>

      <Divider />
      <div className="d-flex d-lg-block flex-column align-items-center justify-content-center">
        <AButton
          style={{ verticalAlign: 'middle', width: '200px' }}
          className="mt-3 mt-lg-0 ml-lg-3 px-5"
          size="large"
          type="ghost"
          onClick={props.onCancel}
          icon={<CloseOutlined />}>
          {props.cancelText || t('close')}
        </AButton>
      </div>
    </>
  );
};

export default connect(
  (state) => ({
    user: state['authUser'].user
  }),
  {
    getPricingProductDetail: pricingSystemActions.getPricingProductDetail
  }
)(ViewForm);
