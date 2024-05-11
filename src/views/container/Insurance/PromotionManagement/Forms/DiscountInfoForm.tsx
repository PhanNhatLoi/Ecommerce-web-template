import { Form } from 'antd/es';
import { head, last } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import { TYPOGRAPHY_TYPE } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import { DISCOUNT_UNIT, LIMIT_UNIT } from '~/configs/type/promotionType';
import { promotionActions } from '~/state/ducks/insurance/promotion';
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
  getPromotionDetail: any;
  createInsuranceDiscount: any;
  dirty: boolean;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  updatePromotion: (body: any, id: number) => void;
}) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const history = useHistory();
  const params = useParams();
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [itemPackage, setItemPackage] = useState<any[]>([]);
  const [unLimitTime, setUnlimitTime] = useState<boolean>(false);
  const [bannerFile, setBannerFile] = useState<any>();
  const [content, setContent] = useState('');
  const [data, setData] = useState<any>();
  const [dirty, setDirty] = useState<boolean>(false);
  const [resetForm, setResetForm] = useState<boolean>(false);

  useEffect(() => {
    if (params?.id) {
      props
        .getPromotionDetail(params?.id)
        .then((res) => {
          const response = res?.content;
          setData(response);
          const unTime = new Date(response?.endDate).getFullYear() === 9999 ? true : false;
          setUnlimitTime(unTime);
          form.setFieldsValue({
            daytime: unTime ? null : [moment(response?.startDate), moment(response?.endDate)],
            startDate: moment(response?.startDate),
            name: response?.name,
            code: response?.code,
            content: response?.content,
            images: head(response?.images)?.url
          });
          setBannerFile(firstImage(head(response?.images)?.url));
          setContent(response?.content);
          setDirty(false);
        })
        .catch((err) => {
          console.error(err);
        });
    }
  }, []);

  const onFormChange = () => {
    setDirty(true);
  };

  const submitForm = (action: any, body: any, Message: string) => {
    action(body, params?.id || null)
      .then(() => {
        setDirty(false);
        form.resetFields();
        AMessage.success(t(`${Message}`));
        history.push(PATH.INSURANCE_PROMOTION_LIST_PATH);
        setSubmitting(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: PromotiomAddNew.tsx ~ line 54 ~ onFinish ~ err', err);
        AMessage.error(t(err.message));
        setSubmitting(false);
      });
  };

  const validValuePackageDiscount = (value: any): boolean => {
    if (value.minQuantity <= 0) return false;
    if (
      (value?.discountType === DISCOUNT_UNIT.CASH && value?.discount < LIMIT_UNIT.MIN_CASH) ||
      (value?.discountType === DISCOUNT_UNIT.TRADE && value?.discount > LIMIT_UNIT.MAX_TRADE)
    )
      return false;
    return true;
  };

  const checkValueDiscount = (values: any): boolean => {
    // check empty data table
    if (!itemPackage.length) {
      AMessage.error(t('fill_discount_list'));
      return false;
    }
    //check values package discount
    if (values?.insurancePackages?.length) {
      const checkValue = values.insurancePackages.some((item: any): boolean => !validValuePackageDiscount(item));
      if (checkValue) {
        AMessage.error(t('discount_invalid'));
        return false;
      }
    }
    return true;
  };

  // On finish
  const onFinish = (values) => {
    setSubmitting(true);

    const startDate = new Date(values?.startDate?._d || values?.daytime[0]?._d);
    let endDate = new Date(values?.startDate?._d || values?.daytime[1]?._d);
    if (unLimitTime) endDate.setFullYear(9999);

    const body: any = {
      name: values.name,
      images: [{ url: values.images, type: 'IMAGE' }],
      startDate: startDate,
      endDate: endDate,
      content: values.content,
      id: params?.id || undefined,
      insurancePackages: itemPackage || undefined
    };
    if (!checkValueDiscount(body)) {
      setSubmitting(false);
      return;
    }
    params?.id
      ? submitForm(props.updatePromotion, body, 'update_promotion_success')
      : submitForm(props.createInsuranceDiscount, body, 'create_promotion_success');
  };
  // On finish fail
  const onFinishFailed = (err) => {
    console.error('trandev ~ file: PromotionAddNew.js ~ line 68 ~ onFinishFailed ~ err', err);
    setSubmitting(false);
  };

  const handleReset = () => {
    form.resetFields();
    setUnlimitTime(false);
    setResetForm(true);
    setDirty(false);
  };

  const onBannerChange = (file: string[]) => {
    setDirty(Boolean(file));
    setBannerFile(firstImage(last(file)) || '');
    form.setFieldsValue({ images: head(file) });
  };

  return (
    <HOC>
      <Card>
        <CardHeader
          titleHeader={params?.id ? t('edit_promotion') : t('new_promotion')}
          btn={
            <div>
              <BackBtn onClick={() => history.push(PATH.INSURANCE_PROMOTION_LIST_PATH)} />
              <SubmitBtn disabled={!dirty} loading={submitting} onClick={() => form.submit()} />
            </div>
          }></CardHeader>

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
            onValuesChange={onFormChange}
            onFinishFailed={onFinishFailed}>
            <Prompt when={dirty} message={t('leave_confirm')} />
            <PromotionSetting
              form={form}
              unLimitTime={unLimitTime}
              setUnlimitTime={setUnlimitTime}
              content={content}
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
                data={data}
                setDirty={setDirty}
                itemPackage={itemPackage}
                setItemPackage={setItemPackage}
                reset={resetForm}
                setReset={setResetForm}
              />
            </div>
            <Divider />
            <Form.Item className="mt-5">
              <div className="d-flex flex-wrap justify-content-center align-item-center">
                <SubmitBtn loading={submitting} disabled={!dirty} />
                <ResetBtn onClick={handleReset} />
                <CancelBtn onClick={() => history.push(PATH.INSURANCE_PROMOTION_LIST_PATH)} />
              </div>
            </Form.Item>
          </Form>
        </CardBody>
      </Card>
    </HOC>
  );
};

export default connect(null, {
  getPromotionDetail: promotionActions.getPromotionDetail,
  createInsuranceDiscount: promotionActions.createInsuranceDiscount,
  updatePromotion: promotionActions.updatePromotion
})(PromotionAddNew);
