import React, { useState } from 'react';
import { connect } from 'react-redux';
import { Checkbox, Col, Row } from 'antd/es';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { MInputNumber } from '~/views/presentation/fields/input';
import { DISCOUNT_UNIT, STEP_UNIT, LIMIT_UNIT, CONVERSION_UNIT } from '~/configs/type/promotionType';
import MRadio from '~/views/presentation/fields/Radio';
import * as Types from '../Type';

const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
  }
  .ant-input-number-group-addon:last-child {
    background-color: white;
  }
  .ant-input-number-input {
    font-size: 12px;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

const CouponItem = (props: {
  type: string;
  unlimit: Types.unlimitType;
  setUnlimit: React.Dispatch<React.SetStateAction<Types.unlimitType>>;
  setType: React.Dispatch<React.SetStateAction<string>>;
}) => {
  const { t }: any = useTranslation();
  const [checkUnlimitValue, setCheckUnlimitValue] = useState<boolean>(props.type === DISCOUNT_UNIT.CASH ? false : true);

  const handleChangeUnlimit = (e: any) => {
    props.setUnlimit((pre: Types.unlimitType) => {
      return {
        ...pre,
        [e.target.name]: !props.unlimit[e.target.name]
      };
    });
  };

  return (
    <Row>
      <Col xs={24} sm={24} md={11} lg={11} className="mb-8">
        <MInputNumberStyled
          require
          className="w-100"
          labelAlign="left"
          label={t('discount_value')}
          noPadding
          customLayout="w-100"
          hasFeedback={false}
          controls={true}
          colon={true}
          name="discount"
          max={props.type === DISCOUNT_UNIT.TRADE ? LIMIT_UNIT.MAX_TRADE : LIMIT_UNIT.MAX_CASH}
          min={LIMIT_UNIT.MIN_TRADE}
          step={props.type === DISCOUNT_UNIT.CASH ? STEP_UNIT.VND : STEP_UNIT.PERCENT}
          addonAfter={
            <MRadio
              spaceSize={0}
              label=""
              name="type"
              options={[
                { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
                { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
              ]}
              onChange={(e: any) => {
                props.setType(e.target.value);
                setCheckUnlimitValue(props.type === DISCOUNT_UNIT.CASH ? false : true);
              }}
              optionType="button"
              buttonStyle="solid"
            />
          }
        />
      </Col>
      <Col md={2} lg={2} />
      <Col xs={24} sm={24} md={11} lg={11} className="mb-8">
        <MInputNumberStyled
          label={t('max')}
          className="w-100 mb-3"
          disabled={(props?.unlimit?.maxDiscount || props.type === DISCOUNT_UNIT.CASH) ?? false}
          colon={false}
          min={LIMIT_UNIT.MIN_CASH}
          step={STEP_UNIT.VND}
          noPadding
          noLabel
          require={!(props?.unlimit?.maxDiscount || props.type === DISCOUNT_UNIT.CASH) ?? false}
          prefix={CONVERSION_UNIT.CASH}
          hasFeedback={false}
          name="maxDiscount"
        />
        <Checkbox
          checked={props?.unlimit?.maxDiscount}
          name="maxDiscount"
          disabled={checkUnlimitValue || props.type === DISCOUNT_UNIT.CASH}
          onChange={handleChangeUnlimit}>
          <span style={{ fontSize: 12 }}>{t('unlimited')}</span>
        </Checkbox>
      </Col>
      <Col xs={24} sm={24} md={11} lg={11} className="mb-8">
        <MInputNumberStyled
          className="w-100 mb-3"
          noLabel
          disabled={props.unlimit.quantity}
          colon={false}
          require={!props.unlimit.quantity}
          min={1}
          label={t('apply_quantity')}
          noPadding
          hasFeedback={false}
          name="quantityLimit"
        />
        <Checkbox checked={props.unlimit.quantity} name="quantity" onChange={handleChangeUnlimit}>
          <span style={{ fontSize: 12 }}>{t('unlimited')}</span>
        </Checkbox>
      </Col>
      <Col md={2} lg={2} />
      <Col xs={24} sm={24} md={11} lg={11} className="mb-5">
        <MInputNumberStyled
          className="w-100 mb-3"
          disabled={props.unlimit.quantityForUser}
          colon={false}
          min={1}
          require={!props.unlimit.quantityForUser}
          label={t('maximum_applications')}
          noPadding
          noLabel
          hasFeedback={false}
          name="quantityLimitForUser"
        />
        <Checkbox checked={props.unlimit.quantityForUser} name="quantityForUser" onChange={handleChangeUnlimit}>
          <span style={{ fontSize: 12 }}>{t('unlimited')}</span>
        </Checkbox>
      </Col>
    </Row>
  );
};

export default connect(null, {})(CouponItem);
