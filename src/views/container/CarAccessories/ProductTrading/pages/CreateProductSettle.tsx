import React from 'react';
import { useTranslation } from 'react-i18next';
import { Col, Row } from 'antd/es';
import LayoutForm from '~/views/presentation/layout/forForm';
import { MInputNumberStyled } from './CreateProduct';

interface CreateTradingSettleProps {}
const CreateProductSettle: React.FC<CreateTradingSettleProps> = () => {
  const { t }: any = useTranslation();

  return (
    <Col>
      <LayoutForm data-aos="fade-right" data-aos-delay="500" title={t('Stock_title')} description={t('Stock_desc')}>
        <Row>
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputNumberStyled
              controls={false}
              label={t('stock_quantity_lable')}
              placeholder={t('Ex:100')}
              colon={false}
              noPadding
              require
              className="w-100"
              customLayout="w-100"
              // formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              name="stockQuantity"
            />
          </Col>
          <Col xs={24} sm={24} md={2} lg={2} />
          <Col xs={24} sm={24} md={11} lg={11}>
            <MInputNumberStyled
              label={t('Low stock threshold')}
              placeholder={t('Ex:100')}
              colon={false}
              noPadding
              controls={false}
              require
              className="w-100"
              customLayout="w-100"
              // formatter={(value: String) => value.replace(/\B(?=(\d{3})+(?!\d))/g, '')}
              name="lowStockThreshold"
            />
          </Col>
        </Row>
      </LayoutForm>
    </Col>
  );
};

export default CreateProductSettle;
