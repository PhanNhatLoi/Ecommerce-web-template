import { Col, Row } from 'antd/es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { PROMOTION_SERVICE_DISCOUNT_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import { CONVERSION_UNIT, DISCOUNT_UNIT, LIMIT_UNIT, STEP_UNIT } from '~/configs/type/promotionType';
import Divider from '~/views/presentation/divider';
import MRadio from '~/views/presentation/fields/Radio';
import MSelect from '~/views/presentation/fields/Select';

import { MInputNumberStyled } from './CouponItem';
import PromotionCondition from './PromotionCondition';
import VehicleSetting from './VehicleSetting';
import { serviceActions } from '~/state/ducks/service';

type PromotionServiceProps = {
  form: any;
  name: number;
  allowEdit: boolean;
  currentType: string;
  getServiceData: any;
};

const PromotionService: React.FC<PromotionServiceProps> = (props) => {
  const { t }: any = useTranslation();
  const [discountType, setDiscountType] = useState(DISCOUNT_UNIT.CASH);

  return (
    <Row>
      <Col span={24} md={11}>
        <MSelect
          name={[props.name, `serviceId${props.currentType}`]}
          noLabel
          noPadding
          allowClear
          label={t('service')}
          placeholder={t('service')}
          disabled={!props.allowEdit}
          searchCorrectly={false}
          fetchData={props.getServiceData}
          valueProperty="id"
          labelProperty="name"
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT}
        />
      </Col>
      <Col span={24} md={2}></Col>
      <Col span={24} md={11}>
        <MInputNumberStyled
          name={[props.name, `discount${props.currentType}`]}
          label={t('discount_value')}
          placeholder={t('discount_value')}
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT}
          className="w-100"
          colon={false}
          noLabel
          noPadding
          readOnly={!props.allowEdit}
          hasFeedback={false}
          max={discountType === DISCOUNT_UNIT.CASH ? LIMIT_UNIT.MAX_CASH : LIMIT_UNIT.MAX_TRADE}
          min={LIMIT_UNIT.MIN_TRADE}
          step={discountType === DISCOUNT_UNIT.CASH ? STEP_UNIT.VND : STEP_UNIT.PERCENT}
          addonAfter={
            <MRadio
              name={[props.name, `discountType${props.currentType}`]}
              require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT}
              noPadding
              spaceSize={0}
              label=""
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

      <PromotionCondition form={props.form} name={props.name} allowEdit={props.allowEdit} currentType={props.currentType} />

      <Divider />

      <VehicleSetting name={props.name} allowEdit={props.allowEdit} currentType={props.currentType} />
    </Row>
  );
};

export default connect(null, {
  getServiceData: serviceActions.getServiceData
})(PromotionService);
