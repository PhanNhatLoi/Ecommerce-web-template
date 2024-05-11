import { CloseOutlined, EyeOutlined } from '@ant-design/icons';
import { Col, Descriptions, Skeleton } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AlignedDescription from '~/views/presentation/ui/description/AlignedDescription';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import AuthVideo from '~/views/presentation/ui/video/AuthVideo';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import WarningStockModal from '../Modals/WarningStockModal';

const LayoutFormStyled = styled(LayoutForm)`
  .images {
    min-height: 118px;
  }
`;

const ViewForm = (props) => {
  const { t }: any = useTranslation();
  const [pageLoading, setPageLoading] = useState(true);
  const [showWarningStockModal, setShowWarningStockModal] = useState(false);
  const [unit, setUnit] = useState<any>();

  useEffect(() => {
    props?.data?.id ? setPageLoading(false) : setPageLoading(true);
    setShowWarningStockModal(props?.data?.stockQuantity <= props?.data?.lowStockThreshold);
  }, [props?.data?.id]);

  useEffect(() => {
    props
      .getUnitList()
      .then((res) => {
        const unitFilter = res?.content?.filter((item) => item.id == props.data.unitId)[0]?.name;
        setUnit(unitFilter);
      })
      .catch((err) => console.error(err));
  }, []);

  const DescriptionItem = (props) => {
    return (
      <AlignedDescription
        contentStyle={{ fontWeight: '500' }}
        column={1}
        labelStyle={{ color: 'rgba(0,0,0,0.5)', width: '200px', verticalAlign: 'top' }}
        colon={false}
        layout={props.layout}
        bordered>
        <Descriptions.Item className={'p-2'} label={props.label} contentStyle={{ fontSize: 13 }}>
          {props.content}
        </Descriptions.Item>
      </AlignedDescription>
    );
  };
  return (
    <>
      <Skeleton loading={pageLoading} active>
        <LayoutFormStyled
          title={t('info_trading_product')}
          // description={t('info_trading_product_des')}
        >
          <Col lg={22}>
            <div>
              <DescriptionItem content={props.data.name} label={t('item_name')} layout />
              <DescriptionItem
                content={props.data.price ? numberFormatDecimal(+props.data.price, ' đ', '') : t('Not_yet_set_up')}
                label={t('price')}
              />
              <DescriptionItem
                content={<div dangerouslySetInnerHTML={{ __html: props.data.description ? props.data?.description : t('Desc_none') }} />}
                label={t('description')}
              />
            </div>
          </Col>
        </LayoutFormStyled>
        <LayoutFormStyled
          title={t('media_trading_product')}
          // description={t('info_trading_product_des')}
        >
          <div className="d-flex align-items-center row gap-3 pl-5">
            {props.data?.media?.length > 0 &&
              props.data?.media?.map((item, index) =>
                item.type === 'VIDEO' ? (
                  <AuthVideo width="208" key={index} isAuth={true} src={firstImage(item?.url)} />
                ) : (
                  <AuthImage
                    containerClassName="images m-0"
                    key={index}
                    preview={{
                      mask: <EyeOutlined />
                    }}
                    width={100}
                    isAuth={true}
                    src={firstImage(item?.url)}
                  />
                )
              )}
          </div>
        </LayoutFormStyled>
        <Divider />
        <LayoutFormStyled
          title={t('attribute_trading_product')}
          // description={t('info_trading_product_des')}
        >
          <DescriptionItem
            label={t('price_by_quantity')}
            content={
              props.data.prices.length > 0
                ? props.data.prices.map((item) => (
                    <div className="pt-0 ">
                      {`${numberFormatDecimal(+item.fromValue, '', '')} ${t('to')} ${numberFormatDecimal(item.toValue, '', '')} ${t(
                        'products_lower_case'
                      )} - ${numberFormatDecimal(+item.price, ' đ', '')}`}
                    </div>
                  ))
                : t('Not_yet_set_up')
            }
          />

          <DescriptionItem
            label={t('attribute_trading_product')}
            content={
              props.data.attributes.length > 0
                ? props.data.attributes.map((item) => (
                    <div className=" pt-0">
                      {item.name}: {item.value}
                    </div>
                  ))
                : t('Not_yet_set_up')
            }
          />
        </LayoutFormStyled>
        <Divider margin="small" />
        <LayoutFormStyled
          title={t('specification_trading_product_label')}
          // description={t('specification_trading_product_label_des')}
        >
          <DescriptionItem label={t('unit')} content={unit ? unit : t('Not_yet_set_up')} />
          {/* <DescriptionItem label={t('SKU')} content={props.data.conversionSku ? props.data.conversionSku : t('Not_yet_set_up')} /> */}
          <DescriptionItem
            label={t('moq_trading_product_lable')}
            content={props.data.quantityMin ? numberFormatDecimal(+props.data.quantityMin, '', '') : t('Not_yet_set_up')}
          />
        </LayoutFormStyled>
        <Divider margin="small" />
        <LayoutFormStyled
          title={t('Stock_title')}
          // description={t('Stock_title_des')}
        >
          <DescriptionItem label={t('Manage_stock_lable')} content={props.data.isManageStock ? t('set_up') : t('Not_yet_set_up')} />
          <DescriptionItem
            label={t('Stock_title')}
            content={props.data.stockQuantity ? numberFormatDecimal(+props.data.stockQuantity, '', '') : t('Not_yet_set_up')}
          />
          <DescriptionItem
            label={t('Low stock threshold')}
            content={
              props.data.lowStockThreshold
                ? ` ${numberFormatDecimal(+props.data.lowStockThreshold, '', '')} ${t('products_lower_case')}`
                : t('Not_yet_set_up')
            }
          />
        </LayoutFormStyled>
        <Divider margin="small" />
        <LayoutFormStyled
          title={t('shipping_title')}
          // description={t('shipping_info')}
        >
          <DescriptionItem
            label={t('shipping_title')}
            content={
              <div className="pl-2 pt-0">
                {props.data?.shipping &&
                  Object.keys(props.data.shipping).map((key) => {
                    if (key === 'id') return null;
                    return (
                      <div>
                        <span className="text-dark-50"> {t(`product_${key}`)}</span>:{' '}
                        {numberFormatDecimal(+props.data.shipping[key], '', '') || t('Not_yet_set_up')}
                      </div>
                    );
                  })}
              </div>
            }
          />
        </LayoutFormStyled>

        <WarningStockModal modalShow={showWarningStockModal} setModalShow={setShowWarningStockModal} data={props?.data}></WarningStockModal>
      </Skeleton>

      <Divider margin="large" />
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
    </>
  );
};

export default connect(null, {
  getUnitList: tradingProductActions.getUnitList
})(ViewForm);
