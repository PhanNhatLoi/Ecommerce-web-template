import 'moment/locale/vi';

import { Col, ConfigProvider, Form, FormInstance, Row } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TIME_UNITS } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carServices/report';
import { RequireParams } from '~/state/ducks/carServices/report/actions';
import { technicianActions } from '~/state/ducks/technician';
import { supplierActions } from '~/state/ducks/vendors/supplier';
import { DEFAULT_PARAMS_DATE } from '~/views/container/Ecommerce/Report/Components/FilterForm';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';

moment.locale('vi');

type FilterFormProps = {
  tab?: string;
  form: FormInstance<any>;
  params: RequireParams | undefined;
  setParams: React.Dispatch<React.SetStateAction<reportActions.RequireParams | undefined>>;
  setDateType?: React.Dispatch<React.SetStateAction<string>>;
  locale: any;
  getSuppliers: any;
  getTechnicians: any;
};

const FilterForm: React.FC<FilterFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [locale, setLocale] = useState(enUS);
  const [loading, setLoading] = useState(false);

  const timeWatch = Form.useWatch('time', props.form);
  const dateWatch = Form.useWatch('date', props.form);

  useEffect(() => {
    props.form.setFieldsValue({ time: TIME_UNITS.DATE.toLowerCase(), date: [moment().startOf('month'), moment()] });
  }, []);

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
  }, [props.locale]);

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
          supplierId: props.form.getFieldValue('supplierId'),
          userId: props.form.getFieldValue('userId'),
          memberId: props.form.getFieldValue('memberId')
        });
      }
    }
    // ENHANCE LATER
    // {
    //   text: t('save_report'),
    //   handleClick: () => {}
    // },
    // {
    //   text: t('export_excel'),
    //   handleClick: () => {}
    // },
    // {
    //   text: t('print_report'),
    //   handleClick: () => {}
    // }
  ];

  const tabPerson = (tab) => {
    switch (tab) {
      case TABS_REPORT.SUPPLIER:
        return {
          name: 'supplierId',
          label: t('filter_supplier'),
          placeholder: t('select_supplier'),
          fetchData: props.getSuppliers,
          labelProperty: 'name',
          valueProperty: 'id'
        };
      case TABS_REPORT.ECA_USER:
        // change fetchData
        return {
          name: 'userId',
          label: t('filter_eca'),
          placeholder: t('select_eca'),
          fetchData: props.getSuppliers,
          labelProperty: 'fullName',
          valueProperty: 'userId'
        };
      case TABS_REPORT.ECAS_USER:
        return {
          name: 'memberId',
          label: t('filter_ecas'),
          placeholder: t('select_ecas'),
          fetchData: props.getTechnicians,
          labelProperty: 'fullName',
          valueProperty: 'userId'
        };
      default:
        return;
    }
  };

  return (
    <>
      <Row className="mb-10 justify-content-between">
        <Col md={24} lg={7} className="w-100">
          <MSelect //
            name="time"
            noLabel
            noPadding
            require={false}
            label={t('kind_of_time')}
            placeholder={t('kind_of_time')}
            labelAlign="left"
            size="large"
            options={Object.keys(TIME_UNITS).map((type) => {
              return {
                value: TIME_UNITS[type as keyof typeof TIME_UNITS].toLowerCase(),
                label: t(type)
              };
            })}
          />
        </Col>

        <Col md={24} lg={7} className="w-100">
          <ConfigProvider locale={locale}>
            <MRangePicker //
              name="date"
              noLabel
              noPadding
              label={t('from_to_date')}
              require={false}
              disabledDate={false}
              picker={timeWatch}
              format={handleFormatTime(timeWatch)}
            />
          </ConfigProvider>
        </Col>

        <Col md={24} lg={7} className="w-100">
          {[TABS_REPORT.SUPPLIER, TABS_REPORT.ECA_USER, TABS_REPORT.ECAS_USER].includes(props?.tab || '') && (
            <MSelect
              noLabel
              noPadding
              size="medium"
              name={tabPerson(props?.tab)?.name}
              label={tabPerson(props?.tab)?.label}
              placeholder={tabPerson(props?.tab)?.placeholder}
              allowClear
              fetchData={tabPerson(props?.tab)?.fetchData}
              searchCorrectly={false}
              require={false}
              valueProperty={tabPerson(props?.tab)?.valueProperty}
              labelProperty={tabPerson(props?.tab)?.labelProperty}
              validateStatus={loading ? 'validating' : undefined}
            />
          )}
        </Col>
      </Row>

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
  { getSuppliers: supplierActions.getSuppliers, getTechnicians: technicianActions.getTechnicians }
)(FilterForm);
