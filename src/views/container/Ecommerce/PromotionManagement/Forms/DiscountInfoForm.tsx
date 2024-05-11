import { Form } from 'antd/es';
import { head, last } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { DISCOUNT_UNIT, LIMIT_UNIT, PROMOTION_TYPE } from '~/configs/type/promotionType';
import { promotionActions } from '~/state/ducks/promotion';
import {
  CategorieDiscountResponse,
  InvoiceDiscountResponse,
  PromotionBodyRequest,
  PromotionResponse,
  TradingDiscountRequest
} from '~/state/ducks/promotion/actions';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import { BackBtn, CancelBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import DiscountItem from '../component/DiscountItem';
import PromotionSetting from '../component/PromotionSetting';

const PromotionAddNew = (props: {
  data?: PromotionResponse;
  createCategoryDiscount: (body: PromotionBodyRequest) => void;
  createInvoiceDiscount: (body: PromotionBodyRequest) => void;
  createProductDiscount: (body: PromotionBodyRequest) => void;
  dirty: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  updatePromotion: (body: PromotionResponse, id: number) => void;
}) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [itemsProduct, setitemsProduct] = useState<TradingDiscountRequest[]>([]);
  const [itemsCategory, setitemsCategory] = useState<CategorieDiscountResponse[]>([]);
  const [unLimitTime, setUnlimitTime] = useState<boolean>(false);
  const [typeDiscount, setTypeDiscount] = useState<string>(props?.data?.promotionType || PROMOTION_TYPE.INVOICE_DISCOUNT);
  const [bannerFile, setBannerFile] = useState<any>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [invoiceMoreDisable, setInvoiceMoreDisable] = useState<boolean>(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  useEffect(() => {
    if (props?.data) {
      const unTime = new Date(props.data?.endDate).getFullYear() === 9999 ? true : false;
      setUnlimitTime(unTime);
      form.setFieldsValue({
        daytime: unTime ? null : [moment(props.data?.startDate), moment(props.data?.endDate)],
        startDate: moment(props.data?.startDate),
        name: props?.data?.name,
        code: props?.data?.code,
        content: props?.data?.content,
        images: head(props?.data?.images)?.url
      });
      setTypeDiscount(props?.data?.promotionType);
      setBannerFile(firstImage(head(props?.data?.images)?.url));
    }
  }, []);

  const onFormChange = () => {
    setDirty(true);
    if (props.setDirty) props.setDirty(true);
    const items = form.getFieldValue('invoiceDiscounts');
    let checkInvoiceMoreDisable = false;
    items.map((item: InvoiceDiscountResponse) => {
      if (!validValueInvoiceColumn(item) && !checkInvoiceMoreDisable) {
        checkInvoiceMoreDisable = true;
      }
    });
    setInvoiceMoreDisable(checkInvoiceMoreDisable);
  };

  const submitForm = (action: any, body: PromotionBodyRequest, Message: string) => {
    action(body, props?.data?.id || null)
      .then(() => {
        setDirty(false);
        form.resetFields();
        AMessage.success(t(`${Message}`));
        history.push(PATH.CAR_ACCESSORIES_PROMOTION_PATH);
        setSubmitting(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: PromotiomAddNew.tsx ~ line 54 ~ onFinish ~ err', err);
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
  };

  const validValueInvoiceColumn = (value: InvoiceDiscountResponse): boolean => {
    if (!value) return false;
    if (!value?.discount || !value?.discountType || !value?.fromValue || !value?.toValue) return false;
    if (!value?.quantity?.length && !value?.quantityLimit) return false;
    if (value?.fromValue > value?.toValue || value?.fromValue < LIMIT_UNIT.MIN_CASH || value?.toValue < LIMIT_UNIT.MIN_CASH) {
      return false;
    }
    if (
      (value?.discountType === DISCOUNT_UNIT.CASH && value?.discount < LIMIT_UNIT.MIN_CASH) ||
      (value?.discountType === DISCOUNT_UNIT.TRADE && value?.discount > LIMIT_UNIT.MAX_TRADE)
    )
      return false;
    return true;
  };

  const validValueTradingProductDiscount = (value: TradingDiscountRequest): boolean => {
    if (value.minQuantity && value.minQuantity <= 0) return false;
    if (
      (value?.discountType === DISCOUNT_UNIT.CASH && value?.discount && value?.discount < LIMIT_UNIT.MIN_CASH) ||
      (value?.discountType === DISCOUNT_UNIT.TRADE && value?.discount && value?.discount > LIMIT_UNIT.MAX_TRADE)
    )
      return false;
    return true;
  };

  const validValueCategoryDiscount = (value: CategorieDiscountResponse): boolean => {
    if (value.minQuantity <= 0) return false;
    if (
      (value?.discountType === DISCOUNT_UNIT.CASH && value?.discount < LIMIT_UNIT.MIN_CASH) ||
      (value?.discountType === DISCOUNT_UNIT.TRADE && value?.discount > LIMIT_UNIT.MAX_TRADE)
    )
      return false;
    return true;
  };

  const checkValueDiscount = (values: PromotionBodyRequest): boolean => {
    // check empty data table
    if (!values?.invoiceDiscounts?.length && !itemsCategory.length && !itemsProduct.length) {
      AMessage.error(t('fill_discount_list'));
      return false;
    }
    //check values invoice
    if (values?.invoiceDiscounts?.length) {
      const checkValue = values.invoiceDiscounts.some((item: InvoiceDiscountResponse): boolean => !validValueInvoiceColumn(item));
      if (checkValue) {
        AMessage.error(t('discount_invalid'));
        return false;
      }
    }
    //check values tradingProductDiscount
    if (values?.tradingProducts?.length) {
      const checkValue = values.tradingProducts.some((item: TradingDiscountRequest): boolean => !validValueTradingProductDiscount(item));
      if (checkValue) {
        AMessage.error(t('discount_invalid'));
        return false;
      }
    }
    //check values categoryDiscount
    if (values?.categories?.length) {
      const checkValue = values.categories.some((item: CategorieDiscountResponse): boolean => !validValueCategoryDiscount(item));
      if (checkValue) {
        AMessage.error(t('discount_invalid'));
        return false;
      }
    }

    return true;
  };

  // On finish
  const onFinish = (values) => {
    const startDate = new Date(values?.startDate?._d || values?.daytime[0]?._d);
    let endDate = new Date(values?.startDate?._d || values?.daytime[1]?._d);
    if (unLimitTime) endDate.setFullYear(9999);
    setSubmitting(true);
    //invoice check unlimit
    let invoiceDiscounts = values.invoiceDiscounts;
    if (typeDiscount === PROMOTION_TYPE.INVOICE_DISCOUNT) {
      invoiceDiscounts.map((invoice) => {
        if (invoice?.quantity?.length) invoice.quantityLimit = null;
      });
    }
    const body: PromotionBodyRequest = {
      name: values.name,
      images: [{ url: values.images, type: 'IMAGE' }],
      startDate: startDate,
      endDate: endDate,
      content: values.content,
      id: props?.data?.id || undefined,
      promotionType: props?.data?.promotionType || undefined,
      invoiceDiscounts: typeDiscount === PROMOTION_TYPE.INVOICE_DISCOUNT ? invoiceDiscounts : undefined,
      categories: typeDiscount === PROMOTION_TYPE.CATEGORY_DISCOUNT ? itemsCategory : undefined,
      tradingProducts: typeDiscount === PROMOTION_TYPE.PRODUCT_DISCOUNT ? itemsProduct : undefined
    };
    if (!checkValueDiscount(body)) {
      setSubmitting(false);
      return;
    }

    let apiUrl;
    switch (typeDiscount) {
      case PROMOTION_TYPE.INVOICE_DISCOUNT:
        apiUrl = props.createInvoiceDiscount;
        break;
      case PROMOTION_TYPE.PRODUCT_DISCOUNT:
        apiUrl = props.createProductDiscount;
        break;
      case PROMOTION_TYPE.CATEGORY_DISCOUNT:
        apiUrl = props.createCategoryDiscount;
        break;
      default:
        break;
    }

    props.data ? submitForm(props.updatePromotion, body, 'update_promotion_success') : submitForm(apiUrl, body, 'create_promotion_success');
  };
  // On finish fail
  const onFinishFailed = (err) => {
    console.error('trandev ~ file: PromotionAddNew.js ~ line 68 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const handleReset = () => {
    form.resetFields();
    setUnlimitTime(false);
    form.setFieldsValue({
      invoiceDiscounts: []
    });
    setInvoiceMoreDisable(false);
    setResetForm(true);
    setDirty(false);
    if (!props.data) setTypeDiscount(PROMOTION_TYPE.INVOICE_DISCOUNT);
  };

  const onBannerChange = (file: string[]) => {
    setDirty(Boolean(file));
    setBannerFile(firstImage(last(file)) || '');
    form.setFieldsValue({ images: head(file) });
  };

  return (
    <HOC>
      <Card>
        {!props.data && (
          <CardHeader
            titleHeader={t('new_promotion')}
            btn={
              <div>
                <BackBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_PROMOTION_PATH)} />
                <SubmitBtn disabled={!dirty} loading={submitting} onClick={() => form.submit()} />
              </div>
            }></CardHeader>
        )}
        <CardBody>
          <Form //
            requiredMark={false}
            {...ANT_FORM_SEP_LABEL_LAYOUT}
            scrollToFirstError={{
              behavior: 'smooth',
              block: 'center',
              inline: 'center',
              scrollMode: 'always'
            }}
            form={form}
            onFinish={onFinish}
            onFieldsChange={onFormChange}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <PromotionSetting
              unLimitTime={unLimitTime}
              setUnlimitTime={setUnlimitTime}
              bannerFile={bannerFile}
              onBannerChange={onBannerChange}
            />
            <Divider />
            <div className={`p-0 col-sm-12 col-md-12 d-flex flex-column`}>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                {t('setting_discount')}
              </ATypography>
              <ATypography variant={TYPOGRAPHY_TYPE.PARAGRAPH} type="secondary">
                {t('setting_discount_des')}
              </ATypography>
              <DiscountItem
                data={props?.data && props.data}
                setDirty={setDirty}
                type={typeDiscount}
                setType={setTypeDiscount}
                itemsProduct={itemsProduct}
                itemsCategory={itemsCategory}
                setitemsProduct={setitemsProduct}
                setitemsCategory={setitemsCategory}
                invoiceMoreDisable={invoiceMoreDisable}
                reset={resetForm}
                setReset={setResetForm}
              />
            </div>
            <Divider />
            <Form.Item className="mt-5">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <SubmitBtn loading={submitting} disabled={!dirty} />
                <ResetBtn onClick={handleReset} />
                <CancelBtn onClick={() => history.push(PATH.CAR_ACCESSORIES_PROMOTION_PATH)} />
              </div>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
    </HOC>
  );
};

export default connect(null, {
  updatePromotion: promotionActions.updatePromotion,
  createInvoiceDiscount: promotionActions.createInvoiceDiscount,
  createProductDiscount: promotionActions.createProductTradingDiscount,
  createCategoryDiscount: promotionActions.createCategoryDiscount
})(PromotionAddNew);
