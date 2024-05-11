import { Form } from 'antd/es';
import { head, last } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { DISCOUNT_UNIT, LIMIT_UNIT, PROMOTION_TYPE } from '~/configs/type/promotionType';
import { promotionActions } from '~/state/ducks/promotion';
import { CouponBodyRequest, PromotionBodyRequest } from '~/state/ducks/promotion/actions';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, CancelBtn, ResetBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card as Card, CardBody, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import CouponItem from '../component/CouponItem';
import PromotionSetting from '../component/PromotionSetting';
import * as Types from '../Type';

const CouponAddNew = (props: {
  createCoupon: (body: CouponBodyRequest) => void;
  updatePromotion: (body: PromotionBodyRequest, id: number) => void;
  data?: CouponBodyRequest;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [discountUnit, setDiscountUnit] = useState<string>(DISCOUNT_UNIT.CASH);
  const [oldCouponCode, setOldCouponCode] = useState<string>('');
  const [dirty, setDirty] = useState<boolean>(false);
  const [unLimitTime, setUnLimitTime] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<any>();
  const [unLimit, setUnlimit] = useState<Types.unlimitType>({
    time: false,
    maxDiscount: false,
    quantity: false,
    quantityForUser: false
  });

  useEffect(() => {
    if (props?.data?.coupons?.length) {
      const unlimitTime =
        new Date(props.data?.endDate ? props.data?.endDate : 0).getFullYear() -
          new Date(props.data?.startDate ? props.data?.startDate : 0).getFullYear() ===
        9999
          ? true
          : false;

      const unlimitQuantity = props.data.coupons[0].quantityLimit ? false : true;
      const unlimitQuantityForUser = props.data.coupons[0].quantityLimitForUser ? false : true;
      const unlimitmaxDiscount = props.data.coupons[0].maxDiscount || props.data.coupons[0].type === DISCOUNT_UNIT.CASH ? false : true;
      setUnlimit(() => {
        return {
          time: unlimitTime,
          maxDiscount: unlimitmaxDiscount,
          quantity: unlimitQuantity,
          quantityForUser: unlimitQuantityForUser
        };
      });
      form.setFieldsValue({
        daytime: unlimitTime ? null : [moment(props.data?.startDate), moment(props.data?.endDate)],
        startDate: moment(props.data?.startDate),
        name: props?.data?.name,
        code: props?.data?.coupons[0]?.couponCode || undefined,
        content: props?.data?.content || undefined,
        type: props?.data.coupons[0]?.type,
        discount: props?.data?.coupons[0]?.discount,
        maxDiscount: props?.data?.coupons[0]?.maxDiscount,
        quantityLimit: props?.data?.coupons[0]?.quantityLimit,
        quantityLimitForUser: props?.data?.coupons[0]?.quantityLimitForUser,
        images: head(props?.data?.images)?.url
      });
      setDiscountUnit(props?.data?.coupons[0]?.type);
      setOldCouponCode(props?.data?.coupons[0]?.couponCode);
      setBannerFile(firstImage(head(props?.data?.images)?.url));
    }
  }, []);

  const submitForm = (action, body, Message) => {
    if (props?.data) {
      // to update Promotion information
      action(body, body.id)
        .then(() => {
          setDirty(false);
          form.resetFields();
          history.push(PATH.CAR_ACCESSORIES_PROMOTION_PATH);
          AMessage.success(t(`${Message}`));
          setSubmitting(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 78 ~ onFinish ~ err', err);
          AMessage.error(err.message);
          setSubmitting(false);
        });
    } else {
      //add new
      action(body)
        .then((res) => {
          setDirty(false);
          form.resetFields();
          history.push(PATH.CAR_ACCESSORIES_PROMOTION_PATH);
          AMessage.success(t(`${Message}`));
          setSubmitting(false);
        })
        .catch((err) => {
          console.error('trandev ~ file: InfoForm.js ~ line 78 ~ onFinish ~ err', err);
          AMessage.error(t(err.message));
          setSubmitting(false);
        });
    }
  };
  // On finish
  const onFinish = (values) => {
    if (checkValue(values)) {
      const startDate = new Date(values?.startDate?._d || values?.daytime[0]?._d);
      let endDate = new Date(values?.startDate?._d || values?.daytime[1]?._d);
      if (unLimitTime) endDate.setFullYear(9999);
      setSubmitting(true);
      const body = {
        // case have infomation of promotion
        name: values.name,
        id: props?.data?.id || null,
        startDate: startDate,
        // code: values.code,
        endDate: endDate,
        content: values.content,
        images: [{ url: values.images, type: 'IMAGE' }],
        promotionType: props?.data?.promotionType,
        coupons: [
          {
            couponCode: values.code === oldCouponCode ? null : values.code,
            discount: values.discount,
            type: discountUnit,
            id: props?.data?.coupons ? props?.data?.coupons[0]?.id : null,
            quantityLimit: unLimit.quantity ? null : values.quantityLimit,
            maxDiscount: unLimit.maxDiscount || discountUnit === DISCOUNT_UNIT.CASH ? null : values.maxDiscount,
            quantityLimitForUser: unLimit.quantityForUser ? null : values.quantityLimitForUser
          }
        ]
      };
      props?.data
        ? submitForm(props.updatePromotion, body, 'update_coupon_success')
        : submitForm(props.createCoupon, body, 'create_coupon_success');
    }
  };

  const checkValue = (value): boolean => {
    const { discount, quantityLimit, quantityLimitForUser, type } = value;
    if (type === DISCOUNT_UNIT.CASH && discount < LIMIT_UNIT.MIN_CASH) {
      AMessage.error(t('discount_invalid'));
      return false;
    }
    if (type === DISCOUNT_UNIT.TRADE && discount > LIMIT_UNIT.MAX_TRADE) {
      AMessage.error(t('discount_invalid'));
      return false;
    }
    if (quantityLimit < quantityLimitForUser) {
      AMessage.error(t('quantity_limit_for_user_invalid'));
      return false;
    }
    return true;
  };
  // On finish fail
  const onFinishFailed = (err) => {
    console.error('trandev ~ file: CouponAddNew.js ~ line 68 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const handleResetForm = () => {
    setDirty(false);
    form.resetFields();
    setUnlimit({
      time: false,
      maxDiscount: false,
      quantity: false,
      quantityForUser: false
    });
    setDiscountUnit(DISCOUNT_UNIT.CASH);
  };

  const onFormChange = () => {
    setDirty(true);
    if (props.setDirty) props.setDirty(true);
  };

  const onBannerChange = (file: string[]) => {
    setDirty(Boolean(file));
    setBannerFile(firstImage(last(file)) || '');
    form.setFieldsValue({ images: head(file) });
  };

  return (
    <HOC>
      <Card>
        {!props?.data && (
          <CardHeader
            titleHeader={t('new_coupon')}
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
            onFinishFailed={onFinishFailed}
            onFieldsChange={onFormChange}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <PromotionSetting
              type={PROMOTION_TYPE.COUPON_DISCOUNT}
              unLimitTime={unLimitTime}
              setUnlimitTime={setUnLimitTime}
              bannerFile={bannerFile}
              onBannerChange={onBannerChange}
            />
            <Divider />
            <LayoutForm title={t('setting_coupon')} description={t('setting_coupon_des')}>
              <CouponItem type={discountUnit} setType={setDiscountUnit} unlimit={unLimit} setUnlimit={setUnlimit} />
            </LayoutForm>
            <Divider />
            <Form.Item className="mt-5">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <SubmitBtn loading={submitting} disabled={!dirty} />
                <ResetBtn onClick={handleResetForm} />
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
  createCoupon: promotionActions.createCoupon,
  updatePromotion: promotionActions.updatePromotion
})(CouponAddNew);
