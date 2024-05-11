import { Col, Row } from 'antd/es';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { PROMOTION_SERVICE_DISCOUNT_TYPE } from '~/configs/status/car-services/promotionServiceStatus';
import Divider from '~/views/presentation/divider';
import { MInput } from '~/views/presentation/fields/input';

import PromotionCondition from './PromotionCondition';
import VehicleSetting from './VehicleSetting';

type PromotionWithoutPriceProps = {
  form: any;
  name: number;
  allowEdit: boolean;
  currentType: string;
};

const PromotionWithoutPrice: React.FC<PromotionWithoutPriceProps> = (props) => {
  const { t }: any = useTranslation();

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
          require={props.currentType === PROMOTION_SERVICE_DISCOUNT_TYPE.UNAVAILABLE_PRICE_DISCOUNT}
        />
      </Col>

      <PromotionCondition form={props.form} name={props.name} allowEdit={props.allowEdit} currentType={props.currentType} />

      <Divider />

      <VehicleSetting name={props.name} allowEdit={props.allowEdit} currentType={props.currentType} />
    </Row>
  );
};

export default PromotionWithoutPrice;
