import { EyeOutlined } from '@ant-design/icons';
import { Empty, Select } from 'antd/es';
import { head } from 'lodash';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';
import { DEFAULT_AVATAR } from '~/configs/default';
import { quotationActions } from '~/state/ducks/mechanic/quotation';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { replaceVniToEng } from '~/views/utilities/helpers/string';
import { firstImage } from '~/views/utilities/helpers/utilObject';

import ProductServiceList from './ProductServiceList';
import MCheckbox from '~/views/presentation/fields/Checkbox';

type ProductServiceInfoProps = {
  form: any;
  productServiceList: any;
  setProductServiceList: any;
  productServiceIds: any;
  setProductServiceIds: any;
  selectedProductService: any;
  setSelectedProductService: any;
  checkAllProductServiceWatch: any;
  allowEditing: boolean;
  acceptProductServiceFlag: string;
  getPricingSystems: any;
  setLoading: any;
};

const ProductServiceInfo: React.FC<ProductServiceInfoProps> = (props) => {
  const params = useParams<any>();
  const { t }: any = useTranslation();
  const [productServiceLoading, setProductServiceLoading] = useState(false);
  const [productServiceAcceptedLoading, setProductServiceAcceptedLoading] = useState(false);

  // get product service list
  useEffect(() => {
    props.setLoading(true);
    setProductServiceLoading(true);
    props
      .getPricingSystems({ sort: 'lastModifiedDate,desc', size: 99999 })
      .then((res: any) => {
        const user = res?.content?.map((item: any) => {
          return {
            id: +item?.id,
            image: item?.image,
            name: item?.name,
            salePrice: item?.salePrice,
            search: `${item?.name}-${item?.salePrice}`
          };
        });
        props.setProductServiceList(user);
        if (params.id && props.acceptProductServiceFlag === 'ALL' && props.productServiceIds.length === 0) {
          props.setProductServiceIds(user.map((user: any) => user.id));
        }
        setProductServiceLoading(false);
        props.setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: InfoForm.tsx:129 ~ useEffect ~ err:', err);
        setProductServiceLoading(false);
        props.setLoading(false);
      });
    // eslint-disable-next-line
  }, [props.acceptProductServiceFlag]);

  return (
    <div className="pt-5">
      <div className="mb-5">
        <ATypography>{t('product/servicesList')}</ATypography>
      </div>
      <div>
        <Select //
          className="w-100"
          value={props.productServiceList}
          showSearch
          disabled={props.checkAllProductServiceWatch[0]}
          filterOption={(input, option) => {
            const childrenOption = option?.search || option?.value;
            return replaceVniToEng(childrenOption.toLowerCase()).indexOf(replaceVniToEng(input.toLowerCase())) >= 0;
          }}
          loading={productServiceLoading}
          notFoundContent={productServiceLoading ? <ASpinner /> : <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} />}
          onChange={(value) => {
            const newVendor: any = head(props.productServiceList.filter((item: any) => item.id === value));
            if (newVendor)
              props.setSelectedProductService((selectedProductService: any) => {
                if (!selectedProductService.map((user: any) => user.id).includes(newVendor?.id))
                  return [
                    ...selectedProductService,
                    ...[
                      {
                        name: newVendor?.name,
                        salePrice: newVendor?.salePrice,
                        image: newVendor?.image,
                        id: newVendor?.id
                      }
                    ]
                  ];
                else return [...selectedProductService];
              });
          }}
          placeholder={t('receiver_placeholder').toString()}>
          {props.productServiceList?.map((vendor: any, i: number) => {
            return (
              <Select.Option key={i} value={vendor.id} search={vendor.search}>
                <div className="d-flex align-items-center">
                  <div>
                    <AuthAvatar
                      className="mr-3"
                      preview={{
                        mask: <EyeOutlined />
                      }}
                      size={50}
                      isAuth
                      src={firstImage(vendor.image) || DEFAULT_AVATAR}
                    />
                  </div>
                  <div className="d-flex flex-column">
                    <div>
                      <strong>{vendor.name}</strong>
                    </div>
                    <div>
                      <span>
                        {t('id')}: {vendor.id}
                      </span>
                    </div>
                    <div>
                      {t('price')}: {numberFormatDecimal(vendor.salePrice || 0, ' đ', '')}
                    </div>
                  </div>
                </div>
              </Select.Option>
            );
          })}
        </Select>
      </div>
      <div className="mt-5">
        <MCheckbox
          name="checkAll"
          noLabel
          noPadding
          disabled={!props.allowEditing}
          label={t('')}
          placeholder={t('')}
          labelAlign="left"
          colon={true}
          require={false}
          className="mb-4"
          options={[{ label: t('selectAllProductService'), value: true }]}
        />
      </div>
      <div>
        {!props.checkAllProductServiceWatch[0] && (
          <ProductServiceList
            setData={props.setSelectedProductService}
            data={props.selectedProductService}
            productServiceAcceptedLoading={productServiceAcceptedLoading}
          />
        )}
      </div>
    </div>
  );
};

export default connect(null, {
  getPricingSystems: quotationActions.getPricingSystems
})(ProductServiceInfo);
