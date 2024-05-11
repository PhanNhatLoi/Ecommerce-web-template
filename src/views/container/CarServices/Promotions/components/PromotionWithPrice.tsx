import { Col, Row } from 'antd/es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PROMOTION_SERVICE_DISCOUNT_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import { CONVERSION_UNIT, DISCOUNT_UNIT, LIMIT_UNIT, STEP_UNIT } from '~/configs/type/promotionType';
import Divider from '~/views/presentation/divider';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';

import { MInputNumberStyled } from './CouponItem';
import VehicleSetting from './VehicleSetting';

type PromotionWithPriceProps = {
  form: any;
  name: number;
  allowEdit: boolean;
  currentType: string;
};

const PromotionWithPrice: React.FC<PromotionWithPriceProps> = (props) => {
  const { t }: any = useTranslation();
  const [discountType, setDiscountType] = useState(
    props.form.getFieldValue(['promotionSetting', props.name, `type${props.currentType}`]) || DISCOUNT_UNIT.CASH
  );

  return (
    <Row>
      <Col span={24}>
        <MInput
          name={[props.name, `name${props.currentType}`]}
          noLabel
          noPadding
          disabled={!props.allowEdit}
          label={t('promotionName')}
          placeholder={t('promotionName')}
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT}
        />
      </Col>

      <Col span={24} md={11}>
        <MInputNumber
          name={[props.name, `price${props.currentType}`]}
          noLabel
          noPadding
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT}
          hasFeedback={false}
          controls={false}
          disabled={!props.allowEdit}
          label={`${t('originalPrice')} (đ)`}
          placeholder={t('originalPrice')}
        />
      </Col>
      <Col span={24} md={2}></Col>
      <Col span={24} md={11} className="w-100">
        <MInputNumberStyled
          name={[props.name, `discount${props.currentType}`]}
          label={t('discount_value')}
          placeholder={t('discount_value')}
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT}
          className="w-100"
          colon={false}
          noLabel
          noPadding
          disabled={!props.allowEdit}
          hasFeedback={false}
          max={discountType === DISCOUNT_UNIT.CASH ? LIMIT_UNIT.MAX_CASH : LIMIT_UNIT.MAX_TRADE}
          min={LIMIT_UNIT.MIN_TRADE}
          step={discountType === DISCOUNT_UNIT.CASH ? STEP_UNIT.VND : STEP_UNIT.PERCENT}
          addonAfter={
            <MRadio
              noPadding
              spaceSize={0}
              label=""
              require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT}
              name={[props.name, `type${props.currentType}`]}
              options={[
                { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
                { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
              ]}
              onChange={(e: any) => setDiscountType(e.target.value)}
              optionType="button"
              buttonStyle="solid"
              disabled={!props.allowEdit}
            />
          }
        />
      </Col>

      <Divider />

      <VehicleSetting name={props.name} allowEdit={props.allowEdit} currentType={props.currentType} />
    </Row>
  );
};

export default PromotionWithPrice;
