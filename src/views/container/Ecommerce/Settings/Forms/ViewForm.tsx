import { CloseOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { itemsActions } from '~/state/ducks/items';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';

const ViewForm = (props) => {
  const { t }: any = useTranslation();
  const [itemDetail, setItemDetail]: any = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  const renderItemInfo = [
    {
      item: props.data?.name,
      label: t('specification_name')
    },
    {
      item: props.data?.shortName,
      label: t('specification_des_name')
    }
  ];

  const renderItemDes = [
    {
      item: props.data?.description,
      label: t('description')
    }
  ];
  let image = '';
  itemDetail?.mainMedia?.map((i) => {
    image = i.url;
  });
  return (
    <>
      <Skeleton loading={pageLoading} active>
        <Row>
          <Col lg={24} md={24}>
            <AlignedDescription
              contentStyle={{ fontWeight: '500' }}
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
              colon={false}
              bordered>
              {renderItemInfo.map((item) => {
                return (
                  <Descriptions.Item className="pb-0" label={item.label} contentStyle={{ fontSize: '12px' }}>
                    {item.item}
                  </Descriptions.Item>
                );
              })}
            </AlignedDescription>

            <AlignedDescription
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: 'max-content', verticalAlign: 'top' }}
              contentStyle={{ display: 'flex', fontWeight: '500', alignItems: 'flex-start', padding: '0px' }}
              colon={false}
              layout="vertical"
              bordered>
              {renderItemDes.map((item) => {
                return (
                  <Descriptions.Item className="pb-0" label={item.label} contentStyle={{ fontSize: '12px' }}>
                    {item?.item && <div dangerouslySetInnerHTML={{ __html: item.item }} />}
                  </Descriptions.Item>
                );
              })}
            </AlignedDescription>
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
  (state: any) => ({
    user: state['authUser'].user
  }),
  {
    // getPricingProductDetail: pricingSystemActions.getPricingProductDetail,
    getItemsDetail: itemsActions.getItemsDetail
  }
)(ViewForm);
