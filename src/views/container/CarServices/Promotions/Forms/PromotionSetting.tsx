import { Form } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { PROMOTION_SERVICE_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import MRadio from '~/views/presentation/fields/Radio';
import AButton from '~/views/presentation/ui/buttons/AButton';

import CouponItem from '../components/CouponItem';
import PromotionItem from '../components/PromotionItem';

type PromotionSettingProps = {
  form: any;
  allowEdit: boolean;
  promotionType: string;
  promotionDiscountType: string;
  setPromotionDiscountType: any;
};

const PromotionSetting: React.FC<PromotionSettingProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <div className="row">
      <div className="col-12 mb-4 w-100">
        <MRadio
          name="promotionType"
          label={t('')}
          noLabel
          colon={true}
          disabled={!props.allowEdit}
          defaultValue={PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT}
          options={Object.keys(PROMOTION_SERVICE_TYPE).map((o) => {
            return {
              value: PROMOTION_SERVICE_TYPE[o],
              search: t(PROMOTION_SERVICE_TYPE[o]),
              label: t(PROMOTION_SERVICE_TYPE[o])
            };
          })}
        />
      </div>

      <div className="col-12">
        {props.promotionType === PROMOTION_SERVICE_TYPE.OFFER_DISCOUNT && (
          <Form.List name="promotionSetting">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => {
                  return (
                    <div className="mt-5">
                      <PromotionItem //
                        form={props.form}
                        data={undefined}
                        itemKey={key}
                        remove={remove}
                        name={name}
                        allowEdit={props.allowEdit}
                        promotionType={props.promotionType}
                        promotionDiscountType={props.promotionDiscountType}
                        setPromotionDiscountType={props.setPromotionDiscountType}
                      />
                    </div>
                  );
                })}
                <Form.Item>
                  <div className="p-5 col-12 col-lg-5">
                    <AButton //
                      type="primary"
                      disabled={!props.allowEdit}
                      onClick={add}
                      block>
                      {t('more_item')}
                    </AButton>
                  </div>
                </Form.Item>
              </>
            )}
          </Form.List>
        )}

        {props.promotionType === PROMOTION_SERVICE_TYPE.COUPON_DISCOUNT && <CouponItem allowEdit={props.allowEdit} />}
      </div>
    </div>
  );
};

export default PromotionSetting;
