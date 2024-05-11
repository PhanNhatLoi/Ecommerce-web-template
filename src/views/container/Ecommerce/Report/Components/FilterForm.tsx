import 'moment/locale/vi';

import { Button, Col, ConfigProvider, Form, FormInstance, Row } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ECA_USER, TIME_UNITS } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { RequireParams } from '~/state/ducks/carAccessories/report/actions';
import { categoryActions } from '~/state/ducks/categories';
import { Category } from '~/views/container/CarAccessories/ProductTrading/Types';
import { MInput } from '~/views/presentation/fields/input';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';

// lấy 11 tháng trước tính từ tháng hiện tại
export const DEFAULT_PARAMS: any = {
  fromDate: moment().subtract(11, 'months').startOf('month').toJSON(),
  toDate: moment().toJSON()
};

// lấy tất cả ngày trong tháng hiện tại
export const DEFAULT_PARAMS_DATE: any = {
  fromDate: moment().startOf('month').toJSON(),
  toDate: moment().toJSON()
};

const DEFAULT_DELIVERY = 'Viettel Post';

type FilterFormProps = {
  tab?: string;
  form: FormInstance<any>;
  params?: RequireParams;
  setParams: any;
  setDateType?: React.Dispatch<React.SetStateAction<string>>;
  locale: string;
  getCategories: any;
};

const FilterForm: React.FC<FilterFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [locale, setLocale] = useState(enUS);

  const [categoryList, setCategoryList] = useState<Category[]>([]);

  const timeWatch = Form.useWatch('time', props.form);
  const dateWatch = Form.useWatch('date', props.form);

  useEffect(() => {
    props.form.setFieldsValue({ time: TIME_UNITS.DATE.toLowerCase(), date: [moment().startOf('month'), moment()] });
    props
      .getCategories()
      .then((res: { content: Category[] }) => {
        const categories = getAllCatalog(res?.content);
        setCategoryList([...categories]);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: FilterForm.tsx: 62 ~ useEffect ~ err', err);
      });
  }, []);

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
  }, [props.locale]);

  const getAllCatalog = (catalogList: Category[]) => {
    let sub: Category[] = [];
    const flattenCatalog = catalogList?.map((catalog: Category) => {
      if (catalog?.subCatalogs && catalog?.subCatalogs?.length) {
        sub = [...sub, ...catalog.subCatalogs];
      }
      return catalog;
    });
    return flattenCatalog.concat(sub?.length ? getAllCatalog(sub) : sub);
  };

  const handleGetTimeValue = (timeWatch: any) => {
    return {
      beginTime: dateWatch ? moment(dateWatch[0]).startOf(timeWatch).toJSON() : DEFAULT_PARAMS_DATE.fromDate,
      endTime: dateWatch ? moment(dateWatch[1]).endOf(timeWatch).toJSON() : DEFAULT_PARAMS_DATE.toDate
    };
  };

  const handleFormatTime = (timeWatch: string) => {
    switch (timeWatch) {
      case TIME_UNITS.DATE.toLowerCase():
        return 'DD/MM/YYYY';
      case TIME_UNITS.MONTH.toLowerCase():
        return 'M/YYYY';
      case TIME_UNITS.QUARTER.toLowerCase():
        return (value: any) => `Q${value.format('Q/YYYY')}`;
      default:
        return 'YYYY';
    }
  };

  const actionBtn = [
    {
      text: t('search'),
      handleClick: () => {
        const time = handleGetTimeValue(timeWatch);

        if (props.setDateType) props.setDateType(timeWatch);
        props.setParams({
          ...props.params,
          fromDate: time.beginTime,
          toDate: time.endTime,
          createdDateFrom: time.beginTime,
          createdDateTo: time.endTime,
          keyword: props.form.getFieldValue('keyword'),
          categoryId: props.form.getFieldValue('categoryId'),
          deliveryPartner: props.form.getFieldValue('deliveryPartner')
        });
      }
    },
    {
      text: t('save_report'),
      handleClick: () => {}
    }
    // ENHANCE LATER
    // {
    //   text: t('export_excel'),
    //   handleClick: () => {}
    // },
    // {
    //   text: t('print_report'),
    //   handleClick: () => {}
    // }
  ];

  return (
    <>
      <Row className="mb-10 justify-content-between">
        <Col md={24} lg={7} className="w-100">
          <MSelect //
            name="time"
            noLabel
            noPadding
            label={t('kind_of_time')}
            placeholder={t('kind_of_time')}
            labelAlign="left"
            size="large"
            options={Object.keys(TIME_UNITS).map((type) => {
              return {
                value: TIME_UNITS[type].toLowerCase(),
                label: type
              };
            })}
          />
        </Col>

        <ConfigProvider locale={locale}>
          <Col md={24} lg={7} className="w-100">
            <MRangePicker //
              name="date"
              noLabel
              noPadding
              label={t('from_to_date')}
              require={false}
              disabledDate={false}
              allowClear={false}
              picker={timeWatch}
              format={handleFormatTime(timeWatch)}
            />
          </Col>

          <Col md={24} lg={7} className="w-100">
            {props.tab === TABS_REPORT.CUSTOMER && (
              <MSelect //
                name="keyword"
                noLabel
                noPadding
                allowClear
                label={t('filter_customers')}
                placeholder={t('customer_list_lowercase')}
                labelAlign="left"
                size="medium"
                options={Object.keys(ECA_USER).map((type) => {
                  return {
                    value: ECA_USER[type],
                    label: t(type)
                  };
                })}
              />
            )}
          </Col>
        </ConfigProvider>

        <Col md={24} lg={7} className="w-100"></Col>
      </Row>

      {(props.tab === TABS_REPORT.PRODUCT || props.tab === TABS_REPORT.SHIPPING) && (
        <Row className="mb-10 justify-content-between">
          <Col md={24} lg={7} className="w-100">
            <MInput //
              name="keyword"
              noLabel
              noPadding
              allowClear
              size="medium"
              labelAlign="left"
              label={t('filter_products')}
              placeholder={t('product_keyword')}
              require={false}
            />
          </Col>

          <Col md={24} lg={7} className="w-100">
            <MSelect //
              name="categoryId"
              noLabel
              noPadding
              allowClear
              label={t('filter_by_category')}
              placeholder={t('category_list')}
              labelAlign="left"
              size="medium"
              options={categoryList?.map((category: Category) => {
                return {
                  value: category.id,
                  label: `${category.id} - ${category.name}`
                };
              })}
            />
          </Col>

          <Col md={24} lg={7} className="w-100">
            <MSelect //
              name="deliveryPartner"
              noLabel
              noPadding
              allowClear
              label={t('delivery_unit')}
              placeholder={t('delivery_unit_list')}
              labelAlign="left"
              size="medium"
              options={[DEFAULT_DELIVERY].map((value) => {
                return {
                  value: value,
                  label: value
                };
              })}
            />
          </Col>
        </Row>
      )}

      <Row className="my-5">
        {actionBtn.map((btn) => {
          return (
            <AButton style={{ width: '120px' }} className="px-5 mr-4 mb-4" size="large" type="primary" onClick={btn.handleClick}>
              {btn.text}
            </AButton>
          );
        })}
      </Row>
    </>
  );
};

export default connect(
  (state: any) => ({
    locale: state['appData']?.locale
  }),
  {
    getCategories: categoryActions.getCategories
  }
)(FilterForm);
