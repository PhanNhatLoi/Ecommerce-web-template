import { CloseCircleFilled, EyeOutlined } from '@ant-design/icons';
import { Avatar } from 'antd/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { DEFAULT_AVATAR } from '~/configs/default';
import AButton from '~/views/presentation/ui/buttons/AButton';
import AuthAvatar from '~/views/presentation/ui/Images/AuthAvatar';
import { AList, AListItem, AListItemMeta } from '~/views/presentation/ui/list/AList';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';
import { firstImage } from '~/views/utilities/helpers/utilObject';

type ProductServiceListType = {
  data: any;
  setData?: any;
  productServiceAcceptedLoading?: boolean;
  viewOnly?: boolean;
};

const ProductServiceList: React.FC<ProductServiceListType> = (props) => {
  const { t } = useTranslation();
  return (
    <AList
      itemLayout="horizontal"
      style={{ maxHeight: 500, overflowY: 'scroll' }}
      className={!props.viewOnly ? 'mt-10' : ''}
      dataSource={props.data}
      loading={props.productServiceAcceptedLoading}
      renderItem={(item: any) => (
        <AListItem>
          <AListItemMeta
            className="d-flex align-items-center"
            avatar={
              item?.avatar?.includes('http') ? (
                <Avatar className="mr-3" size={50} src={item?.image || DEFAULT_AVATAR} style={{ objectFit: 'contain' }} />
              ) : (
                <AuthAvatar
                  className="mr-3"
                  preview={{
                    mask: <EyeOutlined />
                  }}
                  size={50}
                  isAuth={true}
                  src={firstImage(item?.image) || DEFAULT_AVATAR}
                />
              )
            }
            title={item.name}
            description={
              <>
                <div>
                  {t('id')}: {item.id}
                </div>
                <div>
                  {t('price')}: {numberFormatDecimal(item.salePrice || 0, ' đ', '')}
                </div>
              </>
            }
          />
          <div>
            {!props.viewOnly && (
              <AButton
                className="d-flex align-items-center"
                style={{ color: 'rgba(0, 0, 0, 0.25)' }}
                type="link"
                onClick={() =>
                  props.setData(
                    props.data.filter((rec: any) => {
                      return rec.id !== item.id;
                    })
                  )
                }
                icon={<CloseCircleFilled />}
              />
            )}
          </div>
        </AListItem>
      )}
    />
  );
};

export default ProductServiceList;
