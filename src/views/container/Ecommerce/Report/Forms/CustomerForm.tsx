import { Form, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TIME_UNITS } from '~/configs';
import Divider from '~/views/presentation/divider';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import HorizontalBarChart from '../Charts/HorizontalBarChart';
import DetailTable from '../Components/DetailTable';
import FilterForm, { DEFAULT_PARAMS_DATE } from '../Components/FilterForm';
import StatisticList from '../Components/StatisticList';

const { TabPane } = Tabs;

type CustomerFormProps = {
  tab: string;
};

const CustomerForm: React.FC<CustomerFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const [dateType, setDateType] = useState(TIME_UNITS.DATE.toLowerCase());
  const [params, setParams] = useState<any>({ fromDate: DEFAULT_PARAMS_DATE.fromDate, toDate: DEFAULT_PARAMS_DATE.toDate });

  return (
    <Form //
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}>
      <FilterForm form={form} tab={props.tab} params={params} setParams={setParams} setDateType={setDateType} />

      <Divider />

      <StatisticList tab={props.tab} params={params} />

      <Divider />

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={t('overview')} key="1">
          <HorizontalBarChart tab={props.tab} params={params} />
        </TabPane>
        <TabPane tab={t('detail')} key="2">
          <DetailTable tab={props.tab} params={params} dateType={dateType} />
        </TabPane>
      </Tabs>
    </Form>
  );
};

export default CustomerForm;
