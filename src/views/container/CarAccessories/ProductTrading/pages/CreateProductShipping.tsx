import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd/es';
import LayoutForm from '~/views/presentation/layout/forForm';
import { MInputNumberStyled } from './CreateProduct';

interface CreateTradingShippingProps {}
const CreateProductShipping: React.FC<CreateTradingShippingProps> = () => {
  const { t }: any = useTranslation();

  return (
    <Col>
      <LayoutForm data-aos="fade-right" data-aos-delay="600" title={t('shipping_title')} description={t('shipping_des')}>
        <Row>
          <Col md={11} lg={11} sm={11} xs={11}>
            <MInputNumberStyled
              noPadding
              require
              className="w-100"
              customLayout="w-100"
              labelAlign="left"
              name="weight"
              label={t('product_weight')}
              hasFeedback={false}
              controls={false}
              min={1}
              max={1000000}
              // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              placeholder={t('product_weight_placeholder')}
            />
          </Col>
          <Col sm={2} xs={2} md={2} lg={2} />
          <Col md={11} lg={11} sm={11} xs={11}>
            <MInputNumberStyled //
              labelAlign="left"
              name="length"
              require
              noPadding
              hasFeedback={false}
              controls={false}
              min={1}
              max={1000000}
              // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              className="w-100"
              customLayout="w-100"
              label={t('product_length')}
              placeholder={t('product_length_placeholder')}
            />
          </Col>
        </Row>
        <Row>
          <Col md={11} lg={11} sm={11} xs={11}>
            <MInputNumberStyled //
              labelAlign="left"
              name="width"
              require
              noPadding
              hasFeedback={false}
              controls={false}
              min={1}
              max={1000000}
              // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              className="w-100"
              customLayout="w-100"
              label={t('product_width')}
              placeholder={t('product_width_placeholder')}
            />
          </Col>
          <Col sm={2} xs={2} md={2} lg={2} />
          <Col md={11} lg={11} sm={11} xs={11}>
            <MInputNumberStyled //
              labelAlign="left"
              name="height"
              noPadding
              hasFeedback={false}
              controls={false}
              min={1}
              max={1000000}
              // formatter={(value) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              require
              className="w-100"
              customLayout="w-100"
              label={t('product_height')}
              placeholder={t('product_height_placeholder')}
            />
          </Col>
        </Row>
      </LayoutForm>
    </Col>
  );
};

export default CreateProductShipping;
