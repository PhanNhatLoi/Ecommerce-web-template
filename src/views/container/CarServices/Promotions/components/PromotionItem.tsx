import { CloseOutlined } from '@ant-design/icons';
import { Popconfirm, Tabs } from 'antd/es';
import { useTranslation } from 'react-i18next';
import { MInputAddress, MInputPhone } from '~/views/presentation/fields/input';
import AButton from '~/views/presentation/ui/buttons/AButton';

import PromotionService from './PromotionService';
import PromotionWithoutPrice from './PromotionWithoutPrice';
import PromotionWithPrice from './PromotionWithPrice';
import { PROMOTION_SERVICE_DISCOUNT_TYPE } from '~/configs/status/car-services/promotionServiceStatus';

type PromotionItemProps = {
  data?: any;
  itemKey: number;
  name: number;
  remove: (index: number) => void;
  promotionType?: string;
  promotionDiscountType: string;
  setPromotionDiscountType?: any;
  form: any;
  listName?: string;
  needLoadData?: boolean;
  setNeedLoadData?: any;
  allowEdit: boolean;
};

const { TabPane } = Tabs;

const PromotionItem: React.FC<PromotionItemProps> = (props) => {
  const { t }: any = useTranslation();

  const tabList = [
    {
      title: t('availablePrice'),
      key: PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT,
      component: PromotionWithPrice
    },
    {
      title: t('unavailablePrice'),
      key: PROMOTION_SERVICE_DISCOUNT_TYPE.UNAVAILABLE_PRICE_DISCOUNT,
      component: PromotionWithoutPrice
    }
    // { title: t('service'), key: PROMOTION_SERVICE_DISCOUNT_TYPE.SERVICE_DISCOUNT, component: PromotionService }
  ];

  return (
    <>
      {props.promotionType && (
        <div className="p-10" style={{ border: '1px solid #000', position: 'relative' }}>
          {props.allowEdit && (
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
          )}

          <Tabs
            activeKey={
              props.promotionDiscountType === PROMOTION_SERVICE_DISCOUNT_TYPE.COUPON_DISCOUNT
                ? PROMOTION_SERVICE_DISCOUNT_TYPE.AVAILABLE_PRICE_DISCOUNT
                : props.promotionDiscountType
            }
            defaultActiveKey={'availablePrice'}
            type="line"
            onChange={(key: any) => props.setPromotionDiscountType(key)}>
            {tabList.map((tab) => (
              <TabPane tab={tab.title} key={tab.key} disabled={!props.allowEdit}>
                <tab.component form={props.form} name={props.name} allowEdit={props.allowEdit} currentType={props.promotionDiscountType} />
              </TabPane>
            ))}
          </Tabs>
        </div>
      )}

      {/* contacts */}
      {!props.promotionType && (
        <div className="p-10" style={{ border: '1px solid #000', position: 'relative' }}>
          {props.allowEdit && (
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
          )}

          <div className="row">
            <div className="col-12">
              <MInputPhone
                name="phone"
                countryPhone
                listName={props.listName}
                itemIndex={props.name}
                customLayout="w-100"
                noLabel
                noPadding
                size="large"
                label={t('phone')}
                placeholder={t('')}
                require
                phoneTextTranslate="1px"
                disabled={!props.allowEdit}
              />
            </div>
            <div className="col-12">
              <MInputAddress //
                name="addressInfo"
                listName={props.listName}
                itemIndex={props.name}
                form={props.form}
                notRequireZipCode
                label={t('address')}
                customLayout="w-100"
                noLabel
                noPadding
                require
                disabled={!props.allowEdit}
                needLoadData={props.needLoadData}
                setNeedLoadData={props.setNeedLoadData}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default PromotionItem;
