import { CloseOutlined } from '@ant-design/icons';
import { Col, Form, Popconfirm } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { CONVERSION_UNIT, DISCOUNT_UNIT, STEP_UNIT } from '~/configs/type/promotionType';
import { InvoiceDiscountResponse } from '~/state/ducks/promotion/actions';
import MCheckbox from '~/views/presentation/fields/Checkbox';
import { MInputNumber } from '~/views/presentation/fields/input';
import MRadio from '~/views/presentation/fields/Radio';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';

const MInputNumberStyled = styled(MInputNumber)`
  .ant-input-number-group-addon {
    border: none;
    padding: 0px;
    background-color: white;
  }

  .ant-form-item-has-feedback.ant-form-item-has-success .ant-form-item-children-icon {
    right: 79px;
  }
`;

const PromotionPriceItem = (props: {
  data?: InvoiceDiscountResponse;
  add: (defaultValue: any, index: number) => void;
  itemKey: number;
  name: number;
  remove: (index: number) => void;
}) => {
  const { t }: any = useTranslation();
  const [minPrice, setminPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(Number.MAX_SAFE_INTEGER);
  const [unlimit, setUnlimit] = useState<boolean>(props?.data?.quantityLimit || !props?.data ? false : true);
  const [stepDiscount, setStepDiscount] = useState<number>(STEP_UNIT.VND);

  return (
    <div className="m-5">
      <div className="p-10" style={{ border: '1px solid #000', position: 'relative' }}>
        <div style={{ position: 'absolute', top: 0, right: 0 }}>
          <Popconfirm
            placement="topRight"
            title={t('confirm_delete')}
            onConfirm={() => {
              props.remove(props.name);
            }}
            okText={t('okTextConfirm')}
            cancelText={t('cancelTextConfirm')}>
            <AButton icon={<CloseOutlined style={{ color: '#000' }} />} />
          </Popconfirm>
        </div>
        <div className="row">
          <Col xs={10} md={10} lg={10} sm={10}>
            <MInputNumberStyled
              className="w-100"
              require
              label={t('min_price')}
              colon={false}
              onChange={(e) => {
                setminPrice(e?.target?.value || e);
              }}
              max={maxPrice}
              labelAlign="left"
              wrapperCol={{ span: 24 }}
              noLabel
              customLayout
              hasFeedback={false}
              name={[props.name, 'fromValue']}
            />
          </Col>
          <Col xs={0} sm={1} md={1} lg={1} />
          <Col xs={10} md={10} lg={10} sm={10}>
            <MInputNumberStyled
              className="w-100"
              require
              label={t('max_price')}
              onChange={(e) => setMaxPrice(e?.target?.value || e)}
              colon={false}
              min={minPrice}
              labelAlign="left"
              wrapperCol={{ span: 24 }}
              noLabel
              hasFeedback={false}
              name={[props.name, 'toValue']}
            />
          </Col>
          {/*  */}

          <Col xs={10} md={10} lg={10} sm={10}>
            <MInputNumberStyled
              require
              className="w-100"
              colon={false}
              labelAlign="left"
              wrapperCol={{ span: 24 }}
              noLabel
              label={t('discount_value')}
              // max={stepDiscount < LIMIT_UNIT.MAX_TRADE && LIMIT_UNIT.MAX_TRADE}
              hasFeedback={false}
              step={stepDiscount}
              name={[props.name, 'discount']}
              tooltip={{
                icon: (
                  <span>
                    (<ATypography type="danger">*</ATypography>)
                  </span>
                )
              }}
              addonAfter={
                <MRadio
                  noPadding
                  spaceSize={0}
                  label=""
                  name={[props.name, 'discountType']}
                  options={[
                    { label: CONVERSION_UNIT.CASH, value: DISCOUNT_UNIT.CASH },
                    { label: CONVERSION_UNIT.TRADE, value: DISCOUNT_UNIT.TRADE }
                  ]}
                  onChange={(e) => setStepDiscount(e.target.value === DISCOUNT_UNIT.CASH ? STEP_UNIT.VND : STEP_UNIT.PERCENT)}
                  optionType="button"
                  buttonStyle="solid"
                />
              }
            />
          </Col>
          <Col xs={0} sm={1} md={1} lg={1} />
          <Col xs={10} md={10} lg={10} sm={10}>
            <MInputNumberStyled
              require={!unlimit}
              className="w-100"
              disabled={unlimit}
              colon={false}
              min={0}
              labelAlign="left"
              noLabel
              label={t('apply_quantity')}
              hasFeedback={false}
              name={[props.name, 'quantityLimit']}
            />
            <MCheckbox
              name={[props.name, 'quantity']}
              onCheckboxChange={() => {
                setUnlimit(!unlimit);
              }}
              options={[{ label: t('unlimited'), value: 'quantity' }]}
            />
          </Col>
        </div>
      </div>
    </div>
  );
};

const PromotionPriceList = (props: { invoiceMoreDisable: boolean; data?: InvoiceDiscountResponse[] }) => {
  const { t }: any = useTranslation();

  useEffect(() => {
    if (props?.data) {
      let initData = props.data;
      initData.map((e) => {
        if (!e.quantityLimit) {
          e.quantity = ['quantity'];
        }
      });
    }
  }, [props.data]);

  return (
    <Form.List name="invoiceDiscounts" initialValue={props?.data || []}>
      {(fields, { add, remove }) => (
        <>
          {fields.map(({ key, name, ...restField }) => {
            return (
              <div className="mt-5">
                <PromotionPriceItem //
                  data={props?.data && props?.data[key]}
                  itemKey={key}
                  remove={remove}
                  add={add}
                  name={name}
                />
              </div>
            );
          })}
          <Form.Item>
            <div className="p-5 col-lg-3 col-12">
              <AButton //
                type="dashed"
                disabled={props.invoiceMoreDisable}
                onClick={() => add()}>
                {t('more_item')}
              </AButton>
            </div>
          </Form.Item>
        </>
      )}
    </Form.List>
  );
};

export default connect(null, {})(PromotionPriceList);
