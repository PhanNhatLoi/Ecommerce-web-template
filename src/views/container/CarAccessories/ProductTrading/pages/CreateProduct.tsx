import { Form } from 'antd/es';
import { last } from 'lodash-es';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt, useHistory, useLocation } from 'react-router';
import { useBeforeUnload } from 'react-use';
import styled from 'styled-components';
import * as PATH from '~/configs/routesConfig';
import { TRADING_PRODUCT_STATUS_RESPONSE } from '~/configs/status/car-accessories/tradingProductStatus';
import { PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import { tradingProductActions } from '~/state/ducks/carAccessories/ProductTrading';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { MInputNumber } from '~/views/presentation/fields/input';
import { BackBtn, CancelBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';

import WarningPriceModal from '../Modals/WarningPriceModal';
import { Category, Product, Units } from '../Types';
import CreateProductAttributes from './CreateProductAttributes';
import CreateProductFinding from './CreateProductFinding';
import CreateProductPrice from './CreateProductPrice';
import CreateProductSettle from './CreateProductSettle';
import CreateProductShipping from './CreateProductShipping';

export const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }
  .ant-input-number-group-addon:last-child {
    background-color: white;
    // padding-left: 2px;
    // padding-top: 10px;
  }
  .ant-input-number-input {
    font-size: 12px;
    // border-radius: 7px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

interface CreateTradingProductProps {
  createTradingProduct: any;
  updateTradingProduct: any;
  getProductList: any;
  getCategoryList: any;
  getUnitList: any;
  getTradingProductList: any;
  id?: String;
}
const CreateProductTrading: React.FC<CreateTradingProductProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const location = useLocation();
  const id = new URLSearchParams(location.search).get('id');
  const productId = new URLSearchParams(location.search).get('productId');
  const [dirty, setDirty] = useState(false);
  const [submitting, setSubmitting] = useState<Boolean>(false);
  const [showWarningPriceModal, setShowWarningPriceModal] = useState(false);
  const [body, setBody] = useState<any>();
  const [inStockPrice, setInStockPrice] = useState<any>();

  const [currencyValue, setCurrencyValue] = useState<String>(PRICING_UNIT.DONG);
  const [priceSetting, setPriceSetting] = useState<Boolean>(true);
  const [isDisablePrices, setDisableAddPrices] = useState<Boolean>(false);
  const [isDisableAddAttribute, setDisableAddAttribute] = useState<Boolean>(false);

  const [units, setUnits] = useState<Array<Units>>();
  const [categoryName, setCategoryName] = useState<String>();
  const [productSelect, setProductSelect] = useState<Product>();
  const [imgDetail, setImgDetail] = useState<String | undefined>();
  const [productList, setProductList] = useState<Array<Product>>();
  const [categoryList, setCategoryList] = useState<Array<Category>>();

  const [dataChange, setDataChange] = useState<any>([]);
  const [tradingProductInit, setTradingProductInit] = useState<any>();
  const [formCurrent, setFormCurrent] = useState<any>({});
  const initValue = useRef<Array<{ key?: String; name?: String; value?: String }>>();
  initValue.current = [{ key: 'initValue' }];

  useBeforeUnload(dirty, t('leave_confirm'));

  const onFormChange = () => {
    setDirty(true);
  };

  const leaveConfirm = () => {
    if (!dirty) setDirty(false);
  };

  const isUpdatePage = (): Boolean => {
    return location.pathname === PATH.CAR_ACCESSORIES_UPDATE_PRODUCT_TRADING && id ? true : false;
  };

  const handleSelectProduct = (productID: any) => {
    if (productList) {
      const productData: Array<Product> = productList.filter((product: Product) => product.id == productID);

      setProductSelect(productData[0]);

      if (productId) form.setFieldValue('productId', productID);
    }
  };

  const handleSubmitForm = (action: any, body, msg: String) => {
    action(body)
      .then((res) => {
        setDirty(false);
        form.resetFields();
        AMessage.success(t(`${msg}`));
        history.push(PATH.CAR_ACCESSORIES_PRODUCT_TRADING);
        setSubmitting(false);
      })
      .catch((err) => {
        console.error('🚀 ~ file: CreateProductTrading.tsx ~ line 123 ~ handleSumitForm ~ err', err);
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
  };

  const getProductTrading = (nameProduct: String) => {
    const product = productList?.filter((item) => item.name === nameProduct)[0];
    setProductSelect(product);
    return `${product?.id} - ${product?.name} `;
  };

  /**
   * @param {Array<Category>} catalogList
   * @returns  get subcatalog in tree data
   */
  function getSubCatalog(catalogList: Array<Category>): any {
    let sub: Array<Category> = [];
    const flattenCatalog = catalogList?.map((catalog: Category) => {
      if (catalog?.subCatalogs && catalog?.subCatalogs?.length) {
        sub = [...sub, ...catalog.subCatalogs];
      }
      return catalog;
    });
    return flattenCatalog.concat(sub?.length ? getSubCatalog(sub) : sub);
  }

  // Get product list
  useEffect(() => {
    props
      .getProductList({ sort: 'code,asc', page: 0, size: 999999 })
      .then((res: { content: Array<Product> }) => {
        let productData: Array<Product> = res.content?.map((product: Product) => {
          return { ...product, categories: product.categories?.map((item: any) => item.name) };
        });
        const statusResponse = TRADING_PRODUCT_STATUS_RESPONSE;
        productData = productData.filter(
          (product: Product) => product.approveStatus === statusResponse.APPROVED && product.productStatus === statusResponse.ACTIVATED
        );

        if (categoryName) {
          productData = productData?.filter((product: any) => product.categories?.includes(categoryName));
          setProductList(productData);
        } else setProductList(productData);
      })
      .catch((err: any) => console.error(err));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categoryName]);

  // Get catalog list
  useEffect(() => {
    props
      .getCategoryList()
      .then((res: { content: Array<Category> }) => {
        const listCatalog: Array<Category> = getSubCatalog(res.content);
        setCategoryList(listCatalog);
      })
      .catch((err: any) => console.error(err));
  }, []);

  // Get unit list
  useEffect(() => {
    props
      .getUnitList()
      .then((res: { content: Array<Units> }) => {
        setUnits(res.content);
      })
      .catch((err: any) => console.error(err));
  }, []);

  // pageUpdate? pageCreate?
  useEffect(() => {
    if (isUpdatePage() && productList) {
      setDisableAddAttribute(true);
      setDisableAddPrices(true);
      props
        .getTradingProductList({ size: 99999 })
        .then((res: { content: Array<Product> }) => {
          const tradingProduct = res?.content?.filter((item) => item.id == id)[0];

          if (tradingProduct) {
            setTradingProductInit(tradingProduct);
            if (tradingProduct?.media && tradingProduct?.media.length > 0) {
              setImgDetail(tradingProduct?.media?.filter((item) => item.type === 'IMAGE')[0].url);
            }
            tradingProduct.prices.length > 0 ? setPriceSetting(false) : setPriceSetting(true);

            form.setFieldsValue({
              ...tradingProduct,
              productId: getProductTrading(tradingProduct.name),
              isManageStock: true,
              priceValue: tradingProduct.price,
              weight: tradingProduct.shipping?.weight,
              length: tradingProduct.shipping?.length,
              width: tradingProduct.shipping?.width,
              height: tradingProduct.shipping?.height
            });

            setFormCurrent(form.getFieldsValue());
          }
        })
        .catch((err) => {
          console.error('chiendev ~ file: CreateProduct.tsx:227 ~ useEffect ~ err:', err);
          AMessage.error(err);
        });
    }

    if (!isUpdatePage() && productId && location.pathname === PATH.CAR_ACCESSORIES_CREATE_PRODUCT_TRADING) {
      handleSelectProduct(productId.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, productId, productList]);

  // On finish
  const onFinish = (values) => {
    setSubmitting(true);

    const inStockPrice: any = productSelect?.inStockPrice;

    values.id = id;
    values.price = values.priceValue;
    values.approveStatus = !checkValueSubmit(values)
      ? TRADING_PRODUCT_STATUS_RESPONSE.WAITING_FOR_APPROVAL
      : tradingProductInit.approveStatus;
    values.isManageStock = true;
    values.vehicleBrandId = null;
    values.description = productSelect?.description;
    values.promotions = [];
    values.conversionSku = values.conversionSku || 1;

    if (productSelect?.mainMedia && productSelect?.subMedia) {
      values.media = [...productSelect?.mainMedia, ...productSelect?.subMedia];
    }
    if (priceSetting) {
      values.prices = [];
    }
    if (values.price < inStockPrice || values.prices.some((item) => item.price < inStockPrice)) {
      setBody({ ...values });
      setInStockPrice(inStockPrice);
      setShowWarningPriceModal(true);
    } else {
      isUpdatePage()
        ? handleSubmitForm(props.updateTradingProduct, values, 'Update Success')
        : handleSubmitForm(props.createTradingProduct, values, 'Create Success');
    }
  };

  const checkValueSubmit = (body: any): boolean => {
    if (!id) return false;
    let check = true;
    dataChange.map((m) => {
      if (body[m].length) {
        body[m]?.map((atb, index) => {
          Object.keys(atb).forEach((obj) => {
            if (!tradingProductInit[m][index] || atb[obj] !== tradingProductInit[m][index][obj]) check = false;
          });
        });
      } else {
        if (m !== 'prices' && m !== 'attributes' && tradingProductInit[m] !== body[m]) check = false;
      }
    });
    return check;
  };
  // On finish fail
  const onFinishFailed = (err) => {
    console.error('~onFinishFailed err', err);
    setSubmitting(false);
  };

  const handleFormChange = (e: any) => {
    const itemAttribute = form.getFieldValue('attributes');
    const itemPrices = form.getFieldValue('prices');
    const lastItemPrices = last(itemPrices);
    const lastItemAttribute = last(itemAttribute);

    setDisableAddAttribute(itemAttribute?.length === 0 || (lastItemAttribute?.name && lastItemAttribute?.value));
    itemPrices &&
      setDisableAddPrices(itemPrices?.length === 0 || (lastItemPrices?.fromValue && lastItemPrices?.toValue && lastItemPrices?.price));

    // check value init
    if (e.length === 1) {
      if (!dataChange.some((s) => s === e[0].name[0]) && e[0].name[0] !== 'stockQuantity') setDataChange([...dataChange, e[0].name[0]]);
    }
  };

  return (
    <HOC>
      <Card>
        <CardHeader
          //
          titleHeader={t('create_product_trading_title')}
          btn={
            <div>
              <BackBtn
                onClick={() => {
                  leaveConfirm();
                  history.push(PATH.CAR_ACCESSORIES_PRODUCT_TRADING);
                }}
              />
              <SubmitBtn loading={submitting} onClick={() => form.submit()} />
            </div>
          }></CardHeader>
        <CardBody>
          <Form
            style={{ marginRight: '12px' }}
            onFieldsChange={handleFormChange}
            requiredMark={false}
            {...ANT_FORM_SEP_LABEL_LAYOUT}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
              scrollMode: 'always'
            }}
            form={form}
            onChange={onFormChange}
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />

            <CreateProductFinding
              isUpdatePage={isUpdatePage}
              productId={productId}
              form={form}
              setCategoryName={setCategoryName}
              productSelect={productSelect}
              setProductSelect={setProductSelect}
              imgDetail={imgDetail}
              productList={productList}
              categoryList={categoryList}
            />
            <Divider />

            {/* cài đặt thuộc tính riêng cho sản phẩm */}
            <CreateProductAttributes isDisableAddAttribute={isDisableAddAttribute} initValue={initValue} />
            <Divider />

            {/* cài đặt giá bán */}
            <CreateProductPrice
              initValue={initValue}
              currencyValue={currencyValue}
              setCurrencyValue={setCurrencyValue}
              priceSetting={priceSetting}
              setPriceSetting={setPriceSetting}
              isDisablePrices={isDisablePrices}
              productSelect={productSelect}
              units={units}
              form={form}
            />
            <Divider />

            {/* cài đặt kho hàng - kho */}
            <CreateProductSettle />
            <Divider />

            {/* cài đặt vận chuyển - shipping */}
            <CreateProductShipping />
            <Divider />

            <Form.Item className="mt-5">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <SubmitBtn loading={submitting} />
                <ResetBtn
                  onClick={() => {
                    form.resetFields();
                    !isUpdatePage() && setProductSelect(undefined);
                  }}
                />
                <CancelBtn
                  onClick={() => {
                    leaveConfirm();
                    history.push(PATH.CAR_ACCESSORIES_PRODUCT_TRADING);
                  }}
                />
              </div>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>

      <WarningPriceModal
        modalShow={showWarningPriceModal}
        setModalShow={setShowWarningPriceModal}
        isUpdatePage={isUpdatePage}
        handleSubmitForm={handleSubmitForm}
        body={body}
        inStockPrice={inStockPrice}></WarningPriceModal>
    </HOC>
  );
};

export default connect(null, {
  createTradingProduct: tradingProductActions.createTradingProduct,
  updateTradingProduct: tradingProductActions.updateTradingProduct,
  getTradingProductList: tradingProductActions.getTradingProductList,
  getProductList: tradingProductActions.getProductList,
  getCategoryList: tradingProductActions.getCategoryList,
  getUnitList: tradingProductActions.getUnitList
})(CreateProductTrading);
