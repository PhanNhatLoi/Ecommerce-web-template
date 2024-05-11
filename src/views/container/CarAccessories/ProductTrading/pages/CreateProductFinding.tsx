import { EyeOutlined } from '@ant-design/icons';
import { Col, Row } from 'antd/es';
import { FormInstance } from 'antd/es/form/Form';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { TYPOGRAPHY_TYPE } from '~/configs';
import MSelect from '~/views/presentation/fields/Select';
import LayoutForm from '~/views/presentation/layout/forForm';
import AuthImage from '~/views/presentation/ui/Images/AuthImage';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import { Category, Product } from '../Types';

interface CreateProductFindingProps {
  productId?: string | null;
  form: FormInstance<any>;
  setCategoryName: React.Dispatch<React.SetStateAction<String | undefined>>;
  productSelect: Product | undefined;
  setProductSelect: React.Dispatch<React.SetStateAction<Product | undefined>>;
  imgDetail?: String;
  productList?: Product[];
  categoryList?: Category[];
  isUpdatePage: () => Boolean;
}
const CreateProductFinding: React.FC<CreateProductFindingProps> = ({
  productId,
  form,
  setCategoryName,
  productSelect,
  setProductSelect,
  imgDetail,
  productList,
  categoryList,
  isUpdatePage
}) => {
  const { t }: any = useTranslation();

  const handleSelectProduct = (productID: String) => {
    if (productList) {
      const productData: Array<Product> = productList.filter((product: Product) => product.id == productID);
      setProductSelect(productData[0]);

      form.setFieldsValue({ unitId: productData[0]?.unit?.id, priceValue: productData[0]?.inStockPrice });
      if (productId) {
        form.setFieldValue('productId', productID);
      }
    }
  };

  return (
    <Col>
      <LayoutForm title={t('search_product_title')} description={t('search_product_des')}>
        {!isUpdatePage() && (
          <Row>
            <Col xs={24} sm={24} md={11} lg={11}>
              <MSelect //
                noLabel
                allowClear
                labelAlign="left"
                require
                customLayout="w-100"
                noPadding
                name="productId"
                loading={!productList}
                options={productList?.map((item: Product) => {
                  return {
                    value: item.id,
                    label: `${item.code} - ${item.name}`
                  };
                })}
                onChange={(productID: String) => handleSelectProduct(productID)}
                placeholder={t('find_product_by_code_or_name')}
              />
            </Col>

            <Col md={2} lg={2} />
            <Col xs={24} sm={24} md={11} lg={11}>
              <MSelect //
                noLable
                customLayout="w-100"
                allowClear
                labelAlign="left"
                noPadding
                require={false}
                name="catalogs"
                loading={!categoryList}
                onChange={(categoryName: String) => setCategoryName(categoryName)}
                options={categoryList?.map((item) => {
                  return {
                    value: item.name,
                    label: `${item.id} - ${item.name}`
                  };
                })}
                placeholder={t('filter_by_category')}
              />
            </Col>
          </Row>
        )}
        <Row>
          {productSelect && (
            <ProductInfo
              imgSrc={firstImage(isUpdatePage() ? imgDetail : productSelect?.mainMedia[0].url)}
              nameProduct={productSelect.name}
              supplier={productSelect.supplierId}
            />
          )}
        </Row>
      </LayoutForm>
    </Col>
  );
};

const ProductInfo = ({ imgSrc, nameProduct, supplier }) => {
  const { t }: any = useTranslation();
  return (
    <div className="d-flex flex-wrap">
      <div className="mr-8">
        <AuthImage
          preview={{
            mask: <EyeOutlined />
          }}
          width={100}
          height="auto"
          isAuth={true}
          src={imgSrc}
        />
      </div>
      <div className="d-flex flex-column pt-2 justify-content-center">
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          <span style={{ fontSize: '13px' }}>{nameProduct}</span>
        </ATypography>
        <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={5}>
          <span style={{ fontSize: '12px' }}>
            {t('supplier')} : {supplier}
          </span>
        </ATypography>
      </div>
    </div>
  );
};

export default CreateProductFinding;
