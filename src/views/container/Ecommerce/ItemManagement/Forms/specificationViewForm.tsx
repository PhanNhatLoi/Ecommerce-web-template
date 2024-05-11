import { CloseOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { specificationActions } from '~/state/ducks/specification';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AMessage from '~/views/presentation/ui/message/AMessage';

const SpecificationViewForm = (props) => {
  const { t }: any = useTranslation();
  const [specificationDetail, setSpecificationDetail]: any = useState({});
  const [pageLoading, setPageLoading] = useState(false);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getSpecificationDetail(props.id)
        .then((res) => {
          setSpecificationDetail(res?.content);
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: SpecificationViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);
  const renderSpecificationInfo = [
    {
      item: specificationDetail?.specificationCode,
      label: t('specification_code')
    },
    {
      item: specificationDetail?.specificationName,
      label: t('specification_name')
    },
    {
      item: specificationDetail?.exchangeValue,
      label: t('specification_exchange_value')
    },
    {
      item: specificationDetail?.exchangeUnit,
      label: t('specification_exchange_unit')
    }
  ];

  const renderSpecDes = [
    {
      item: specificationDetail?.note,
      label: t('specification_note')
    }
  ];

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
              {renderSpecificationInfo.map((item) => {
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
              {renderSpecDes.map((item) => {
                return (
                  <Descriptions.Item className="pb-0" label={item.label} contentStyle={{ fontSize: '12px' }}>
                    <div dangerouslySetInnerHTML={{ __html: item.item }} />
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
    getSpecificationDetail: specificationActions.getSpecificationDetail
  }
)(SpecificationViewForm);
