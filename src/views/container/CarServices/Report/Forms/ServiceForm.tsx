import { Form, Tabs } from 'antd/es';
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { TIME_UNITS } from '~/configs';
import { DEFAULT_PARAMS_DATE } from '~/views/container/Ecommerce/Report/Components/FilterForm';
import Divider from '~/views/presentation/divider';
import { ANT_FORM_SEP_LABEL_LAYOUT } from '~/views/presentation/table-bootstrap-hook/helperUI';

import HorizontalBarChart from '../Charts/HorizontalBarChart';
import DetailTable from '../Components/DetailTable';
import FilterForm from '../Components/FilterForm';
import StatisticList from '../Components/StatisticList';

const { TabPane } = Tabs;

type ServiceFormProps = {
  tab: string;
};

const ServiceForm: React.FC<ServiceFormProps> = (props) => {
  const { t }: any = useTranslation();
  const [form] = Form.useForm();

  const [dateType, setDateType] = useState(TIME_UNITS.DATE.toLowerCase());
  const [params, setParams] = useState<any>({ fromDate: DEFAULT_PARAMS_DATE.fromDate, toDate: DEFAULT_PARAMS_DATE.toDate });

  return (
    <Form //
      {...ANT_FORM_SEP_LABEL_LAYOUT}
      form={form}>
      <FilterForm form={form} params={params} setParams={setParams} setDateType={setDateType} />

      <Divider />

      <StatisticList tab={props.tab} params={params} />

      <Divider />

      <Tabs defaultActiveKey="1" type="card">
        <TabPane tab={t('overview').toString()} key="1">
          <HorizontalBarChart tab={props.tab} params={params} />
        </TabPane>
        <TabPane tab={t('detail').toString()} key="2">
          <DetailTable tab={props.tab} params={params} dateType={dateType} />
        </TabPane>
      </Tabs>
    </Form>
  );
};

export default ServiceForm;
