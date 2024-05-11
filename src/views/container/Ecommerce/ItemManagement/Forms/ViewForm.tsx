import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Descriptions, Row, Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { itemsActions } from '~/state/ducks/items';
import Divider from '~/views/presentation/divider';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AMessage from '~/views/presentation/ui/message/AMessage';
import AuthVideo from '~/views/presentation/ui/video/AuthVideo';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

const ViewForm = (props) => {
  const { t }: any = useTranslation();
  const [itemDetail, setItemDetail]: any = useState({});
  const [pageLoading, setPageLoading] = useState(false);
  const [mainCategory, setMainCategory] = useState('');
  const [subCategory, setSubCategory] = useState('');
  const [subVideo, setSubVideo] = useState([]);

  useEffect(() => {
    if (Boolean(props.id)) {
      setPageLoading(true);
      props
        .getItemsDetail(props.id)
        .then((res) => {
          const response = res?.content;
          setItemDetail(response);
          setMainCategory(response?.categories[response?.categories?.length - 1]?.name);
          setSubCategory(response?.categories[0]?.name);
          setSubVideo(response?.subMedia);
          setPageLoading(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: ViewForm.js ~ line 31 ~ useEffect ~ err', err);
          AMessage.error(t(err.message));
          setPageLoading(false);
        });
    }
  }, [props.id]);

  const renderItemInfo = [
    {
      item: itemDetail?.code,
      label: t('item_id')
    },
    {
      item: itemDetail?.name,
      label: t('item_name')
    },
    {
      item: itemDetail?.upcCode,
      label: t('barcode')
    },
    {
      item: itemDetail?.oldCode,
      label: t('old_item_id')
    },
    {
      item: itemDetail?.shortName,
      label: t('item_type')
    },
    {
      item: itemDetail?.unit?.name,
      label: t('unit')
    },
    {
      item: itemDetail?.keywords,
      label: t('item_key_word')
    },
    {
      item: itemDetail?.tags,
      label: t('tags')
    },
    {
      item: itemDetail?.inStockPrice ? numberFormatDecimal(+itemDetail?.inStockPrice, ' đ', '') : '',
      label: t('in_stock_price')
    },
    {
      item: `${itemDetail?.guaranteeTime} ${t('month')}`,
      label: t('guaranteeTime')
    },
    {
      item: mainCategory,
      label: t('main_commodity_group')
    },
    {
      item: subCategory,
      label: t('second_commodity_group')
    }
  ];

  const renderItemDes = [
    {
      item: itemDetail?.description,
      label: t('goods_overview')
    },
    {
      item: itemDetail?.details,
      label: t('goods_detail')
    },
    {
      item: itemDetail?.specifications,
      label: t('technical_parameter')
    },
    {
      item: itemDetail?.note,
      label: t('note')
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
          <Col lg={12} md={24}>
            <AlignedDescription
              contentStyle={{ fontWeight: '500' }}
              column={1}
              labelStyle={{ color: 'rgba(0,0,0,0.4)', width: '200px', verticalAlign: 'top' }}
              colon={false}
              bordered>
              {renderItemInfo.map((item) => {
                return (
                  <Descriptions.Item className="pb-5" label={item.label} contentStyle={{ fontSize: '12px' }}>
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
                  <Descriptions.Item className="pb-5" label={item.label} contentStyle={{ fontSize: '12px' }}>
                    <div dangerouslySetInnerHTML={{ __html: item.item }} />
                  </Descriptions.Item>
                );
              })}
            </AlignedDescription>
          </Col>

          <Col lg={2} md={24}></Col>

          <Col lg={10} md={24}>
            <Row>
              {itemDetail?.mainMedia?.map((image, i) => (
                <div className={i !== 0 ? 'd-none d-md-block d-lg-block' : ''}>
                  <Descriptions.Item className="pb-5" label={t('')} contentStyle={{ fontSize: '12px' }}>
                    {t('')}
                  </Descriptions.Item>
                  <AuthImage
                    preview={{
                      mask: <EyeOutlined />
                    }}
                    width={100}
                    isAuth={true}
                    src={firstImage(image?.url)}
                    // onClick={(e) => e.stopPropagation()}
                  />
                </div>
              ))}
            </Row>
            <Row>
              <Descriptions.Item className="pb-5" label={t('')} contentStyle={{ fontSize: '12px' }}>
                {t('')}
              </Descriptions.Item>
              {subVideo?.map((v: any) => (
                <div className="pt-10 pr-5">
                  <AuthVideo width="100%" isAuth={true} src={firstImage(v?.url)} />
                </div>
              ))}
            </Row>
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
