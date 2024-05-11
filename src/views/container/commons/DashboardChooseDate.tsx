import 'moment/locale/vi';

import { ConfigProvider, Form } from 'antd/es';
import enUS from 'antd/es/locale/en_US';
import viVN from 'antd/es/locale/vi_VN';
import moment from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TIME_UNITS } from '~/configs';
import MRangePicker from '~/views/presentation/fields/RangePicker';
import MSelect from '~/views/presentation/fields/Select';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

export const DEFAULT_PARAMS: any = {
  timeBy: TIME_UNITS.DATE.toLowerCase(),
  fromDate: moment().startOf('month').toJSON(),
  toDate: moment().endOf('date').toJSON()
};

type DashboardChooseDateProps = {
  setParams: any;
  locale: any;
};

const DashboardChooseDate: React.FC<DashboardChooseDateProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();
  const [locale, setLocale] = useState(enUS);

  const timeByWatch = Form.useWatch('timeBy', form);
  const dateWatch = Form.useWatch('date', form);

  useEffect(() => {
    setLocale(props.locale === 'vi' ? viVN : enUS);
  }, [props.locale]);

  // set default
  useEffect(() => {
    props.setParams(DEFAULT_PARAMS);
    form.setFieldsValue({ timeBy: DEFAULT_PARAMS.timeBy, date: [moment().startOf('month'), moment().endOf('date')] });
  }, []);

  const handleGetDateValue = (timeByValue: any, dateValue: any) => {
    return {
      timeBy: timeByValue,
      fromDate: moment(dateValue[0]).startOf(timeByValue).toJSON(),
      toDate: moment(dateValue[1]).endOf(timeByValue).toJSON()
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

  return (
    <Form {...ANT_FORM_SEP_LABEL_LAYOUT} form={form}>
      <div className="row">
        <div className="col-12 col-lg-6 col-xl-3 mb-4">
          <MSelect //
            name="timeBy"
            noLabel
            noPadding
            require={false}
            hasFeedback={false}
            allowClear={false}
            label={t('timeBy')}
            placeholder={t('timeBy')}
            labelAlign="left"
            size="large"
            labelCol={{ sm: { span: 5 }, md: { span: 4 }, lg: { span: 7 }, xl: { span: 10 }, xxl: { span: 7 } }}
            wrapperCol={{ sm: { span: 19 }, md: { span: 20 }, lg: { span: 16 }, xl: { span: 12 }, xxl: { span: 8 } }}
            onChange={(value: any) => {
              if (dateWatch) props.setParams(handleGetDateValue(value, dateWatch));
            }}
            options={Object.keys(TIME_UNITS).map((type) => {
              return {
                value: TIME_UNITS[type].toLowerCase(),
                label: type
              };
            })}
          />
        </div>

        <div className="col-12 col-lg-6 col-xl-5">
          <ConfigProvider locale={locale}>
            <MRangePicker //
              name="date"
              noLabel
              noPadding
              label={t('from_to_date')}
              labelAlign="left"
              require={false}
              disabledDate={false}
              locale={locale}
              labelCol={{ sm: { span: 5 }, md: { span: 4 }, lg: { span: 7 }, xl: { span: 7 }, xxl: { span: 5 } }}
              wrapperCol={{ sm: { span: 19 }, md: { span: 20 }, lg: { span: 16 }, xl: { span: 16 }, xxl: { span: 10 } }}
              picker={timeByWatch}
              format={handleFormatTime(timeByWatch)}
              onChange={(value) => {
                if (timeByWatch) props.setParams(handleGetDateValue(timeByWatch, value));
              }}
            />
          </ConfigProvider>
        </div>
      </div>
    </Form>
  );
};

export default connect(
  (state: any) => ({
    locale: state['appData']?.locale
  }),
  {}
)(DashboardChooseDate);
