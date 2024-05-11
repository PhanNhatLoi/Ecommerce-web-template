import { Form } from 'antd/es';
import camelcase from 'camelcase';
import { head, last } from 'lodash-es';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Prompt } from 'react-router';
import { useHistory, useParams } from 'react-router-dom';
import styled from 'styled-components';
import { CONDITION } from '~/configs';
import * as PATH from '~/configs/routesConfig';
import {
  PROMOTION_SERVICE_DISCOUNT_TYPE,
  PROMOTION_SERVICE_STATUS,
  PROMOTION_SERVICE_TYPE
} from '~/configs/status/car-services/promotionServiceStatus';
import { DISCOUNT_UNIT } from '~/configs/type/promotionType';
import { servicePromotionActions } from '~/state/ducks/carServices/promotion';
import HOC from '~/views/container/HOC';
import Divider from '~/views/presentation/divider';
import LayoutForm from '~/views/presentation/layout/forForm';
import { BackBtn, SubmitBtn } from '~/views/presentation/table-bootstrap-hook/ActionBtn';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';
import { Card, CardBody, CardFooter, CardHeader } from '~/views/presentation/ui/card/Card';
import AMessage from '~/views/presentation/ui/message/AMessage';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import PromotionContact from './PromotionContact';
import PromotionInfo from './PromotionInfo';
import PromotionSetting from './PromotionSetting';

const WrapStyleForm = styled.div`
  .no_style_tab {
    :hover {
      border: 1px solid transparent;
      outline: none;
    }
  }
`;

type InfoFormType = {
  getServicePromotionDetail: any;
  createServicePromotions: any;
  updateServicePromotion: any;
  getVendors: any;
  getVendorsApprove: any;
};

const InfoFormProps: React.FC<InfoFormType> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const params = useParams<any>();
  const [dirty, setDirty] = useState(false);
  const [form] = Form.useForm();
  const [allowEdit, setAllowEdit] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(false);
  const [addressNeedLoad, setAddressNeedLoad] = useState<any>();

  const [bannerFile, setBannerFile] = useState<any>();
  const [content, setContent] = useState('');
  const promotionTypeWatch = Form.useWatch('promotionType', form) || PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT;
  const [promotionDiscountType, setPromotionDiscountType] = useState(PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT);
  const [couponId, setCouponId] = useState(undefined);

  // get promotion detail
  useEffect(() => {
    if (params.id) {
      setLoading(true);
      props
        .getServicePromotionDetail(params.id)
        .then((res: any) => {
          const response = res?.content;
          const { id: couponId, ...restKeyCoupon } = (head(response?.coupons) as any) || {};

          form.setFieldsValue({
            ...response,
            ...restKeyCoupon,
            startDate: moment(response?.startDate),
            endDate: response?.endDate ? moment(response?.endDate) : null,
            promotionType:
              response?.promotionType === PROMOTION_SERVICE_DISCOUNT_TYPE.COUPON_DISCOUNT
                ? PROMOTION_SERVICE_TYPE.COUPON_DISCOUNT
                : PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT,
            promotionSetting:
              response?.[`${camelcase(response?.promotionType)}s`]
                ?.map((value: any) => {
                  const { applyToVehicle, condition, ...rest } = value;
                  const {
                    id: vehicleId,
                    brandIds,
                    modelIds,
                    producingYears,
                    businessTypes,
                    applyVehicleCache,
                    ...restKeyVehicle
                  } = applyToVehicle || {};
                  const { brandNames, modelNames } = applyVehicleCache || {};
                  const { id: conditionId, type, ...restKeyCondition } = condition || {};
                  return {
                    ...rest,
                    ...restKeyVehicle,
                    ...restKeyCondition,
                    isCondition: condition && Object.keys(condition)?.length > 0 ? CONDITION.YES : CONDITION.NO,
                    vehicleId,
                    brands:
                      brandIds && brandIds.length > 0 && brandNames && brandNames.length > 0
                        ? brandIds.map((item: number, index: number) => `${item} - ${brandNames[index]}`)
                        : undefined,
                    models:
                      modelIds && modelIds.length > 0 && modelNames && modelNames.length > 0
                        ? modelIds.map((item: number, index: number) => `${item} - ${modelNames[index]}`)
                        : undefined,
                    producingYears: producingYears
                      ? [moment(head(producingYears.split('-'))), moment(last(producingYears.split('-')))]
                      : null,
                    businessTypes: businessTypes || undefined,
                    conditionId,
                    conditionType: type
                  };
                })
                ?.map((obj: any) => {
                  return Object.keys(obj).reduce((acc: any, key) => {
                    acc[key + response?.promotionType] = obj[key];
                    return acc;
                  }, {});
                }) || [],
            promotionContact:
              response?.contacts?.map((value: any) => {
                return {
                  address1: value?.address,
                  country1: value?.countryId,
                  state: value?.stateId,
                  zipCode: value?.zipCode || undefined,
                  province: value?.provinceId,
                  district: value?.districtId,
                  ward: value?.wardsId,
                  code: value?.phoneCode,
                  phone: value?.phone?.toString()
                };
              }) || []
          });
          setCouponId(couponId);
          setBannerFile(firstImage(response?.images));
          setContent(response?.content);
          setPromotionDiscountType(response?.promotionType);
          setAllowEdit([PROMOTION_SERVICE_STATUS.WAITING_FOR_APPROVAL].includes(response.status));
          setAddressNeedLoad(
            response?.contact?.map((value: any) => {
              return {
                country: value?.countryId,
                state: value?.stateId,
                province: value?.provinceId,
                district: value?.districtId,
                ward: value?.wardsId
              };
            }) || []
          );
          setDirty(false);
          setLoading(false);
        })
        .catch((err: any) => {
          setLoading(false);
          console.error(`file: FormInfo.js ~ line 129 ~ useEffect ~ err`, err);
        });
    } else form.setFieldsValue({ promotionType: PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT });
    // eslint-disable-next-line
  }, []);

  const formatYearRange = (value: any) => {
    if (value && value.length > 0) {
      const startYear = moment(value[0]).format('YYYY');
      const endYear = moment(value[1]).format('YYYY');
      return `${startYear}-${endYear}`;
    }
    return null;
  };

  const handlePromotionSetting = (type: string, value: any) => {
    const getValue = (field: string) => value[`${field}${type}`];

    const brandIds = getValue('brands')?.map((value: string) => +value?.split(' - ')[0]);
    const brandNames = getValue('brands')?.map((value: string) => last(value?.split(' - ')));

    const modelIds = getValue('models')?.map((value: string) => +value?.split(' - ')[0]);
    const modelNames = getValue('models')?.map((value: string) => last(value?.split(' - ')));

    const vehicleData = {
      id: getValue('vehicleId') || null,
      brandIds,
      modelIds,
      producingYears: formatYearRange(getValue('producingYears')),
      businessTypes: getValue('businessTypes')
    };

    const commonValue = {
      id: getValue('id') || null,
      name: getValue('name'),
      applyToVehicle: {
        ...vehicleData,
        applyVehicleCache: {
          ...vehicleData,
          brandNames,
          modelNames
        }
      }
    };

    const condition =
      (getValue('isCondition') || CONDITION.NO) === CONDITION.NO
        ? null
        : {
            id: getValue('conditionId') || null,
            type: getValue('conditionType'),
            stringValue: getValue('stringValue')
          };

    switch (type) {
      case PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT:
        return {
          ...commonValue,
          price: getValue('price'),
          discount: getValue('discount'),
          type: getValue('type')
        };
      case PROMOTION_SERVICE_DISCOUNT_TYPE.UNAVAILABLE_PRICE_DISCOUNT:
        return { ...commonValue, condition, description: getValue('description') };
      case PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT:
        return {
          serviceId: getValue('serviceId'),
          discount: getValue('discount'),
          discountType: getValue('discountType'),
          description: getValue('description'),
          applyToVehicle: commonValue.applyToVehicle,
          condition: condition
        };
      default:
        return {};
    }
  };

  const onFinish = (values: any) => {
    setIsSubmitting(true);

    const offers = values.promotionSetting?.map((value: any) => handlePromotionSetting(promotionDiscountType, value)) || [];

    if (offers.length > 0 || promotionTypeWatch === PROMOTION_SERVICE_TYPE.COUPON_DISCOUNT) {
      if (
        promotionDiscountType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT &&
        offers.filter((value: any) => value.type === DISCOUNT_UNIT.CASH).some((value: any) => value.price < value.discount)
      ) {
        AMessage.error(t('errorOriginPrice'));
        setIsSubmitting(false);
      } else {
        const contact =
          values.promotionContact?.map((value: any) => {
            return {
              address: value?.address1,
              countryId: value?.country1,
              stateId: value?.state,
              zipCode: value?.zipCode,
              provinceId: value?.province,
              districtId: value?.district,
              wardsId: value?.ward,
              fullAddress: value.addressInfo?.filter(Boolean)?.join(', '),
              phoneCode: +value?.code,
              phone: value.phone?.startsWith('0') ? value.phone.slice(1) : value.phone
            };
          }) || [];

        const body = {
          name: values.name,
          startDate: values.startDate.toJSON(),
          endDate: values.endDate?.toJSON() || null,
          images: values.images,
          content: values.content,
          contacts: contact
        };

        let promotionBody: any = undefined;
        if (promotionTypeWatch === PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT) {
          promotionBody = Object.assign(
            {},
            { ...body, promotionType: promotionDiscountType },
            promotionDiscountType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT && {
              availablePriceDiscounts: offers
            },
            promotionDiscountType === PROMOTION_SERVICE_DISCOUNT_TYPE.UNAVAILABLE_PRICE_DISCOUNT && {
              unavailablePriceDiscounts: offers
            },
            promotionDiscountType === PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT && { serviceDiscounts: offers }
          );
        } else {
          promotionBody = {
            ...body,
            promotionType: PROMOTION_SERVICE_DISCOUNT_TYPE.COUPON_DISCOUNT,
            coupons: [
              {
                id: couponId,
                couponCode: values.couponCode,
                discount: values.discount,
                type: values.type
              }
            ]
          };
        }

        if (params.id) {
          props
            .updateServicePromotion(params.id, { id: +params.id, ...promotionBody })
            .then(() => {
              setDirty(false);
              history.push(PATH.SERVICE_PROMOTION_PATH);
              AMessage.success(t('servicePromotionUpdateSuccess'));
              setIsSubmitting(false);
            })
            .catch(() => {
              AMessage.error(t('servicePromotionFailed'));
              setIsSubmitting(false);
            });
        } else {
          props
            .createServicePromotions({ ...promotionBody })
            .then(() => {
              setDirty(false);
              history.push(PATH.SERVICE_PROMOTION_PATH);
              AMessage.success(t('servicePromotionCreateSuccess'));
              setIsSubmitting(false);
            })
            .catch(() => {
              AMessage.error(t('servicePromotionCreateFailed'));
              setIsSubmitting(false);
            });
        }
      }
    } else {
      AMessage.error(t('pleaseSettingPromotion'));
      setIsSubmitting(false);
    }
  };

  const onBannerChange = (file: string[]) => {
    setDirty(Boolean(file));
    setBannerFile(firstImage(last(file)) || '');
    form.setFieldsValue({ images: head(file) });
  };

  const handleOnValuesChange = () => {
    setDirty(true);
  };

  return (
    <HOC>
      <WrapStyleForm>
        <Card>
          <CardHeader
            titleHeader={params.id ? t('edit_promotion') : t('new_promotion')}
            btn={
              <div>
                <BackBtn onClick={() => history.push(PATH.SERVICE_PROMOTION_PATH)} />
                {allowEdit && <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
              </div>
            }></CardHeader>
          <CardBody>
            <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form} name={'create'} onValuesChange={handleOnValuesChange} onFinish={onFinish}>
              <Prompt when={dirty} message={t('leave_confirm')} />

              <div className="row">
                <div className="col-12">
                  <LayoutForm title={t('promotionInfo')}>
                    <PromotionInfo
                      form={form}
                      allowEdit={allowEdit}
                      loading={loading}
                      content={content}
                      bannerFile={bannerFile}
                      onBannerChange={onBannerChange}
                    />
                  </LayoutForm>
                </div>
              </div>

              <Divider />

              <div className="row w-100">
                <div className="col-12">
                  <LayoutForm title={t('promotionSetting')}>
                    <PromotionSetting
                      form={form}
                      allowEdit={allowEdit}
                      promotionType={promotionTypeWatch}
                      promotionDiscountType={promotionDiscountType}
                      setPromotionDiscountType={setPromotionDiscountType}
                    />
                  </LayoutForm>
                </div>
              </div>

              <Divider />

              <div className="row w-100">
                <div className="col-12">
                  <LayoutForm title={t('promotionContact')}>
                    <PromotionContact
                      form={form}
                      listName="promotionContact"
                      needLoadData={addressNeedLoad}
                      setNeedLoadData={setAddressNeedLoad}
                      promotionDiscountType={promotionDiscountType}
                      allowEdit={allowEdit}
                    />
                  </LayoutForm>
                </div>
              </div>
            </Form>
          </CardBody>
          <CardFooter className="p-4">
            <div className="d-flex flex-wrap justify-content-center align-item-center">
              <BackBtn onClick={() => history.push(PATH.SERVICE_PROMOTION_PATH)} />
              {allowEdit && <SubmitBtn loading={isSubmitting} onClick={() => form.submit()} />}
            </div>
          </CardFooter>
        </Card>
      </WrapStyleForm>
    </HOC>
  );
};

export default connect(null, {
  getServicePromotionDetail: servicePromotionActions.getServicePromotionDetail,
  createServicePromotions: servicePromotionActions.createServicePromotions,
  updateServicePromotion: servicePromotionActions.updateServicePromotion
})(InfoFormProps);
