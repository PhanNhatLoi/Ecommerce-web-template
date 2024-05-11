import 'moment/locale/vi';

import { Col, ConfigProvider, Form, FormInstance, Row } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TIME_UNITS } from '~/configs';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { RequireParams } from '~/state/ducks/carAccessories/report/actions';
import { DEFAULT_PARAMS_DATE } from '~/views/container/Ecommerce/Report/Components/FilterForm';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import MSelect from '~/views/presentation/fields/Select';
import AButton from '~/views/presentation/ui/buttons/AButton';

type FilterFormProps = {
  tab?: string;
  form: FormInstance<any>;
  params?: RequireParams;
  setParams: React.Dispatch<React.SetStateAction<reportActions.RequireParams | undefined>>;
  setDateType?: React.Dispatch<React.SetStateAction<string>>;
  locale: string;
};

const FilterForm: React.FC<FilterFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [locale, setLocale] = useState(enUS);

  const timeWatch = Form.useWatch('time', props.form); // loại thời gian
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
          createdDateFrom: time.beginTime,
          createdDateTo: time.endTime,
          keyword: props.form.getFieldValue('keyword'),
          categoryId: props.form.getFieldValue('categoryId'),
          deliveryPartner: props.form.getFieldValue('deliveryPartner')
        });
      }
    }
    // ENHANCE LATER
    // {
    //   text: t('save_report'),
    //   handleClick: () => {}
    // }
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
              picker={timeWatch}
              format={handleFormatTime(timeWatch)}
            />
          </Col>

          <Col md={24} lg={7} className="w-100"></Col>
        </ConfigProvider>

        <Col md={24} lg={7} className="w-100"></Col>
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
  {}
)(FilterForm);
