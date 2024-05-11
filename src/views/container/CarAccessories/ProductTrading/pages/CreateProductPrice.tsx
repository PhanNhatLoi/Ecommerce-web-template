import { DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import { Checkbox, Col, Form, FormInstance, Popconfirm, Radio, Row } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { PRICING_STEP, PRICING_UNIT } from '~/configs/status/car-services/pricingSystemStatus';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import AButton from '~/views/presentation/ui/buttons/AButton';
import ATypography from '~/views/presentation/ui/text/ATypography';

import { Product, Units } from '../Types';
import { MInputNumberStyled } from './CreateProduct';
import MRadio from '~/views/presentation/fields/Radio';

interface CreateProductPriceProps {
  initValue: React.MutableRefObject<
    | {
        key?: String | undefined;
        name?: String | undefined;
        value?: String | undefined;
      }[]
    | undefined
  >;
  currencyValue: String;
  setCurrencyValue: React.Dispatch<React.SetStateAction<String>>;
  priceSetting: Boolean;
  setPriceSetting: React.Dispatch<React.SetStateAction<Boolean>>;
  isDisablePrices: Boolean;
  productSelect: Product | undefined;
  units: Units[] | undefined;
  form: FormInstance<any>;
}
const CreateProductPrice: React.FC<CreateProductPriceProps> = ({
  //
  initValue,
  currencyValue,
  setCurrencyValue,
  priceSetting,
  setPriceSetting,
  isDisablePrices,
  productSelect,
  units,
  form
}) => {
  const { t }: any = useTranslation();

  const unitIdWatch = Form.useWatch('unitId', form);
  const handlePriceSetting = () => setPriceSetting(!priceSetting);

  return (
    <Col>
      <LayoutForm
        data-aos="fade-right"
        data-aos-delay="400"
        title={t('setting_price_trading_product_title')}
        description={t('setting_price_trading_product_des')}>
        <Row>
          <Col xs={24} sm={24} md={11} lg={11}>
            <MSelect //
              label={t('specification_trading_product_label')}
              labelAlign="left"
              name="unitId"
              require={true}
              noPadding
              size="large"
              customLayout="w-100"
              options={units?.map((item) => {
                return {
                  value: item.id,
                  label: item.name
                };
              })}
              placeholder={t('specification_trading_product_placeholder')}
            />
          </Col>
          <Col md={2} lg={2} />
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputNumberStyled
              className=" w-100"
              require={false}
              min={1}
              colon={true}
              hidden={unitIdWatch === productSelect?.unit?.id}
              labelAlign="left"
              label={t('SKU_trading_product_lable')}
              noPadding
              customLayout="w-100"
              name="conversionSku"
              hasFeedback={false}
              formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              addonAfter={<span style={{ fontSize: '13px' }}>{productSelect?.unit?.name}</span>}
            />
          </Col>
        </Row>
        <Row className="mt-5">
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputNumberStyled
              className="w-100"
              require
              labelAlign="left"
              noPadding
              customLayout="w-100"
              hasFeedback={false}
              controls={true}
              colon={true}
              name="priceValue"
              label={t('price_trading_product_lable')}
              placeholder={t('price_trading_product_placeholder')}
              min={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
              addonAfter={
                <MRadio
                  noPadding
                  options={[
                    { label: 'đ', value: PRICING_UNIT.DONG },
                    { label: '$', value: PRICING_UNIT.DOLLARS }
                  ]}
                  label=""
                  spaceSize={0}
                  onChange={(e) => setCurrencyValue(e.target.value)}
                  defaultValue={currencyValue}
                  optionType="button"
                  buttonStyle="solid"
                />
              }
              step={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
              tooltip={{
                title: t('required_field'),
                icon: (
                  <span>
                    (<ATypography type="danger">*</ATypography>)
                  </span>
                )
              }}
            />
          </Col>

          <Col md={2} lg={2} />
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputNumberStyled
              className=" w-100"
              controls={false}
              label={t('moq_trading_product_lable')}
              placeholder={t('product_qty_placeholder')}
              colon={false}
              noPadding
              require
              customLayout="w-100"
              hasFeedback={false}
              // formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              name="quantityMin"
            />
          </Col>
        </Row>

        <Row>
          <Checkbox
            style={{ fontSize: '12px', fontWeight: 'normal', padding: '0 10px' }}
            className="pt-2 w-100"
            checked={!priceSetting}
            onClick={handlePriceSetting}
            name="priceSetting">
            {t('setting_price_by_quantity')}
          </Checkbox>
        </Row>

        {!priceSetting && (
          <>
            <Row className="pt-5">
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
                <span style={{ fontSize: '12px', fontWeight: 'normal', padding: '20px 0px' }}>{t('buy_from_label')}</span>
              </ATypography>
            </Row>

            <Form.List name="prices" initialValue={initValue?.current || []}>
              {(fields, { add, remove }) => (
                <Col>
                  {fields.map(({ key, name, fieldKey }) => {
                    return (
                      <Row>
                        <Col xs={5} sm={5} md={5} lg={5}>
                          <MInputNumberStyled
                            itemKey={key}
                            customLayout="w-100"
                            name={[name, 'fromValue']}
                            fieldKey={[fieldKey, 'fromValue']}
                            tooltip={{
                              title: t('buy_from')
                            }}
                            className="w-100"
                            controls={false}
                            colon={false}
                            require
                            noPadding
                            hasFeedback={false}
                            // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                            // addonAfter={<span>{t('buy_to_label')}</span>}
                          />
                        </Col>
                        <Col xs={5} sm={5} md={2} lg={2} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                          <span>{t('buy_to_label')}</span>
                        </Col>
                        <Col xs={5} sm={5} md={5} lg={5}>
                          <MInputNumberStyled
                            customLayout="w-100"
                            itemKey={key}
                            name={[name, 'toValue']}
                            fieldKey={[fieldKey, 'toValue']}
                            tooltip={{
                              title: t('buy_to_label')
                            }}
                            className=" w-100"
                            controls={false}
                            noLable
                            require
                            colon={false}
                            noPadding
                            hasFeedback={false}
                            // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
                          />
                        </Col>
                        <Col xs={1} sm={1} md={1} lg={1} />
                        <Col xs={9} sm={9} md={9} lg={9}>
                          <MInputNumberStyled //
                            controls={false}
                            className="w-100"
                            colon={false}
                            require
                            itemKey={key}
                            name={[name, 'price']}
                            fieldKey={[fieldKey, 'price']}
                            customLayout="w-100"
                            hasFeedback={false}
                            min={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
                            addonAfter={
                              <MRadio
                                noPadding
                                label=""
                                spaceSize={0}
                                options={[
                                  { label: 'đ', value: PRICING_UNIT.DONG },
                                  { label: '$', value: PRICING_UNIT.DOLLARS }
                                ]}
                                onChange={(e) => setCurrencyValue(e.target.value)}
                                defaultValue={currencyValue}
                                optionType="button"
                                buttonStyle="solid"
                              />
                            }
                            step={currencyValue === PRICING_UNIT.DONG ? PRICING_STEP.DONG : PRICING_STEP.DOLLARS}
                          />
                        </Col>
                        <Col xs={1} sm={1} md={1} lg={1} />
                        <Col xs={2} sm={2} md={2} lg={2}>
                          <Popconfirm
                            className=""
                            placement="topRight"
                            title={t('confirm_delete')}
                            onConfirm={() => remove(name)}
                            okText={t('okTextConfirm')}
                            cancelText={t('cancelTextConfirm')}>
                            <AButton icon={<DeleteOutlined />} />
                          </Popconfirm>
                        </Col>
                      </Row>
                    );
                  })}

                  {/* thêm 1 item vào form list */}
                  <Form.Item className="mt-3">
                    <Col style={{ width: 120 }}>
                      <AButton //
                        type="dashed"
                        onClick={() => add()}
                        disabled={!isDisablePrices}
                        icon={<PlusOutlined />}
                      />
                    </Col>
                  </Form.Item>
                </Col>
              )}
            </Form.List>
          </>
        )}
      </LayoutForm>
    </Col>
  );
};

export default CreateProductPrice;
