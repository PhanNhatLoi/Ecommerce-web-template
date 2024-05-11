import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Row, Col, Checkbox, Radio, Space } from 'antd/es';
import PromotionPriceList from '../component/PromotionPriceList';
import TableProduct from '../Table/TableProduct';
import TableCategory from '../Table/TableCategory';
import { DISCOUNT_UNIT, PROMOTION_TYPE } from '~/configs/type/promotionType';
import styled from 'styled-components';
import { tradingProductActions } from '~/state/ducks/tradingProduct';
import { categoryActions } from '~/state/ducks/categories';
import { unitActions } from '~/state/ducks/units';
import {
  PromotionResponse,
  TradingDiscountResponse,
  TradingProductResponse,
  CategorieDiscountResponse,
  TradingDiscountRequest
} from '~/state/ducks/promotion/actions';
import { UnitRespone } from '~/state/ducks/units/actions';

const LineContinerStyled = styled.div`
  overflow: hidden;
  position: relative;
  padding-left: 8px;

  &:before {
    content: '';
    border-left: 1px solid #0094ff;
    position: absolute;
    height: 100%;
  }
`;

const DiscountItem = (props: {
  data?: PromotionResponse;
  getProducts: any;
  getCategories: any;
  getUnits: any;
  itemsProduct: TradingDiscountRequest[];
  setitemsProduct: React.Dispatch<React.SetStateAction<TradingDiscountRequest[]>>;
  itemsCategory: CategorieDiscountResponse[];
  setitemsCategory: React.Dispatch<React.SetStateAction<CategorieDiscountResponse[]>>;
  reset: boolean;
  setReset: React.Dispatch<React.SetStateAction<boolean>>;
  setDirty: React.Dispatch<React.SetStateAction<boolean>>;
  type: string;
  setType: React.Dispatch<React.SetStateAction<string>>;
  invoiceMoreDisable: boolean;
}) => {
  const { t }: any = useTranslation();
  const [indeterminateProduct, setIndeterminateProduct] = useState<boolean>(false);
  const [indeterminateCategory, setIndeterminateCategory] = useState<boolean>(false);

  const [allItem, setAllItem] = useState<{
    product: boolean;
    category: boolean;
  }>({
    product: false,
    category: false
  });
  const [dataTable, setDataTable] = useState<{
    tradingProducts: TradingDiscountResponse[];
    categories: CategorieDiscountResponse[];
  }>({
    tradingProducts: props?.data?.tradingProducts || [],
    categories: props?.data?.categories || []
  });
  const [productList, setProductList] = useState<TradingProductResponse[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [fillData, setFillData] = useState<boolean>(false);

  useEffect(() => {
    // effect list product, categories, unit
    props
      .getProducts({ size: 9999 })
      .then((res) => {
        setProductList(res.content);
      })
      .catch((err) => console.error(err));

    props
      .getCategories({ size: 9999 })
      .then((res) => {
        setCategories(res.content);
      })
      .catch((err) => console.error(err));
  }, []);

  useEffect(() => {
    // check all and uncheck all
    if (props.itemsProduct) {
      setIndeterminateProduct(!!props.itemsProduct.length && props.itemsProduct.length < productList.length);
      setAllItem((pre) => {
        return {
          ...pre,
          product: !(props.itemsProduct.length !== productList.length || !props.itemsProduct.length)
        };
      });
    }
  }, [props.itemsProduct]);

  useEffect(() => {
    // check all and uncheck all
    if (props.itemsCategory) {
      setIndeterminateCategory(!!props.itemsCategory.length && props.itemsCategory.length < categories.length);
      setAllItem((pre) => {
        return {
          ...pre,
          category: !(props.itemsCategory.length !== categories.length || !props.itemsCategory.length)
        };
      });
    }
  }, [props.itemsCategory]);

  useEffect(() => {
    // reset data on table
    if (props.reset) {
      setDataTable({
        tradingProducts: [],
        categories: []
      });
      setAllItem({
        product: false,
        category: false
      });
      props?.setReset(false);
    }
  }, [props?.reset]);

  useEffect(() => {
    // when checked checkbox all
    if (fillData) {
      setFillData(false);
      if (allItem.product) {
        // all product
        let arr: TradingDiscountRequest[] = props.itemsProduct;
        let filterData: TradingProductResponse[] = productList;
        props.itemsProduct.map((m: TradingDiscountRequest) => {
          filterData = filterData.filter((f: TradingProductResponse) => f.itemCode !== m.itemCode);
        });
        filterData.map((e: TradingProductResponse) => {
          const item: TradingDiscountRequest = {
            tradingProduct: e,
            minQuantity: 1,
            quantityLimit: 1,
            discount: 0,
            discountType: DISCOUNT_UNIT.TRADE
          };
          arr.push(item);
        });
        setDataTable((pre: any) => {
          return {
            ...pre,
            tradingProducts: arr
          };
        });
      } else
        setDataTable((pre: any) => {
          return {
            ...pre,
            tradingProducts: []
          };
        });
    }
  }, [allItem.product]);

  useEffect(() => {
    // when checked checkbox all
    if (fillData) {
      setFillData(false);
      if (allItem.category) {
        // all categories
        let arr: CategorieDiscountResponse[] = props.itemsCategory;
        let filterData: any[] = categories;
        props.itemsCategory.map((m: CategorieDiscountResponse) => {
          filterData = filterData.filter((f) => f.id !== m.categoryId);
        });
        filterData.map((e: any) => {
          const item: CategorieDiscountResponse = {
            categoryId: e.id,
            categoryName: e.name,
            minQuantity: 1,
            quantityLimit: 1,
            discount: 0,
            discountType: DISCOUNT_UNIT.TRADE
          };
          arr.push(item);
        });
        setDataTable((pre) => {
          return {
            ...pre,
            categories: arr
          };
        });
      } else
        setDataTable((pre) => {
          return {
            ...pre,
            categories: []
          };
        });
    }
  }, [allItem.category]);

  return (
    <div>
      <Radio.Group
        name="promotion_type"
        className="w-100"
        value={props.type}
        onChange={(e) => {
          if (!props.data) props.setType(e.target.value);
        }}>
        <Space direction="vertical" className="w-100">
          <Radio value={PROMOTION_TYPE.INVOICE_DISCOUNT}>
            <span className="pr-5">{t('Promotion_by_price')}</span>
          </Radio>
          <LineContinerStyled hidden={props.type === PROMOTION_TYPE.INVOICE_DISCOUNT ? false : true}>
            <PromotionPriceList invoiceMoreDisable={props.invoiceMoreDisable} data={props?.data?.invoiceDiscounts || []} />
          </LineContinerStyled>

          <Radio value={PROMOTION_TYPE.PRODUCT_DISCOUNT} className="mt-5">
            <div style={{ display: 'flex' }}>
              <span className="pr-5">{t('Promotion_by_product')}</span>
              <div hidden={props.type === PROMOTION_TYPE.PRODUCT_DISCOUNT ? false : true}>
                <Checkbox
                  indeterminate={indeterminateProduct}
                  checked={allItem.product}
                  onChange={(e) => {
                    setFillData(true);
                    setAllItem((pre) => {
                      return {
                        ...pre,
                        product: e.target.checked
                      };
                    });
                  }}>
                  {t('all')}
                </Checkbox>
              </div>
            </div>
          </Radio>
          <LineContinerStyled hidden={props.type === PROMOTION_TYPE.PRODUCT_DISCOUNT ? false : true}>
            <div className="pl-5">
              <TableProduct setDirty={props.setDirty} data={dataTable.tradingProducts} setdata={(e) => props.setitemsProduct(e)} />
            </div>
          </LineContinerStyled>
          <Radio value={PROMOTION_TYPE.CATEGORY_DISCOUNT}>
            <div style={{ display: 'flex' }} className="mt-5">
              <span className="pr-5">{t('Promotion_by_category')}</span>
              <div hidden={props.type === PROMOTION_TYPE.CATEGORY_DISCOUNT ? false : true}>
                <Checkbox
                  indeterminate={indeterminateCategory}
                  checked={allItem.category}
                  onChange={(e) => {
                    setFillData(true);
                    setAllItem((pre) => {
                      return {
                        ...pre,
                        category: e.target.checked
                      };
                    });
                  }}>
                  {t('all')}
                </Checkbox>
              </div>
            </div>
          </Radio>
          <LineContinerStyled hidden={props.type === PROMOTION_TYPE.CATEGORY_DISCOUNT ? false : true}>
            <div className="pl-5">
              <TableCategory data={dataTable.categories} setdata={(e) => props.setitemsCategory(e)} />
            </div>
          </LineContinerStyled>
        </Space>
      </Radio.Group>
    </div>
  );
};

export default connect(null, {
  getProducts: tradingProductActions.getTradingProduct,
  getCategories: categoryActions.getCategories,
  getUnits: unitActions.getUnits
})(DiscountItem);
