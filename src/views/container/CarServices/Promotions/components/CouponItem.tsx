import { Col, Row } from 'antd/es';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { CONVERSION_UNIT, DISCOUNT_UNIT, LIMIT_UNIT, STEP_UNIT } from '~/configs/type/promotionType';
import { MInput, MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';

export const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-input {
    font-size: 12px;
  }

  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
    background-color: white;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

type PromotionItemProps = { allowEdit: boolean };

const PromotionItem: React.FC<PromotionItemProps> = (props) => {
  const { t }: any = useTranslation();
  const [discountType, setDiscountType] = useState(DISCOUNT_UNIT.CASH);

  return (
    <div className="p-10" style={{ border: '1px solid #000', position: 'relative' }}>
      <Row>
        <Col span={24} md={11}>
          <MInputNumberStyled
            name="discount"
            require
            className="w-100"
            colon={false}
            noLabel
            noPadding
            label={t('discount_value')}
            placeholder={t('discount_value')}
            readOnly={!props.allowEdit}
            max={discountType === DISCOUNT_UNIT.CASH ? LIMIT_UNIT.MAX_CASH : LIMIT_UNIT.MAX_TRADE}
            hasFeedback={false}
            step={discountType === DISCOUNT_UNIT.CASH ? STEP_UNIT.VND : STEP_UNIT.PERCENT}
            addonAfter={
              <MRadio
                noPadding
                spaceSize={0}
                label=""
                name="type"
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
        <Col span={24} md={2}></Col>
        <Col span={24} md={11}>
          <MInput
            name="couponCode"
            require
            noLabel
            noPadding
            disabled={!props.allowEdit}
            label={t('couponCode')}
            placeholder={t('couponCode')}
          />
        </Col>
      </Row>
    </div>
  );
};

export default PromotionItem;
