import { Empty, Progress, Tabs } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/autoClub/dashboard';
import { Card, CardBody } from '~/views/presentation/ui/card/Card';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';

import ChartItem from './ChartItem';

const ProgressStyled = styled(Progress)`
  .ant-progress-inner,
  .ant-progress-outer {
    width: 90% !important;
  }
`;

const ProgressItem = ({ label, percent, total, value }) => {
  return (
    <div className="row mt-4 mb-10">
      <div className="col-3">
        <ATypography>{label}</ATypography>
      </div>
      <div className="col-9">
        <ProgressStyled //
          strokeLinecap="square"
          strokeWidth={15}
          percent={percent}
          format={(percent) => `${value} / ${total}`}
        />
      </div>
    </div>
  );
};

type RequestsProps = {
  params: any;
  getRequestChart: any;
  getRequestSummary: any;
  getRequestCategory: any;
  getRequestCity: any;
};

const Requests: React.FC<RequestsProps> = (props) => {
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [dataChart, setDataChart] = useState([]);
  const [requestSummary, setRequestSummary] = useState<any>();
  const [categoryDistribution, setCategoryDistribution] = useState<any>([]);
  const [cityDistribution, setCityDistribution] = useState<any>([]);

  const fetchData = (action, params, setData) => {
    const { timeBy, ...restParams } = params;
    setLoading(true);
    action({ ...restParams })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 34 ~ useEffect ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getRequestChart, props.params, setDataChart);
    fetchData(props.getRequestSummary, props.params, setRequestSummary);
    fetchData(props.getRequestCategory, { ...props.params, page: 0, size: 5 }, setCategoryDistribution);
    fetchData(props.getRequestCity, { ...props.params, page: 0, size: 5 }, setCityDistribution);
  }, [props.params]);

  const distributionList = [
    {
      key: 1,
      tabTitle: t('by_category').toUpperCase(),
      dataChart: categoryDistribution,
      itemLabel: 'categoryName'
    },
    {
      key: 2,
      tabTitle: t('by_city').toUpperCase(),
      dataChart: cityDistribution,
      itemLabel: 'provinceName'
    }
  ];

  return (
    <React.Fragment>
      <div className="row">
        <div className="col-lg-7">
          <ChartItem
            label={t('requests')}
            data={dataChart || []}
            position="date*count"
            color="type"
            params={props.params}
            loading={loading}
          />
        </div>
        <div className="col-lg-5">
          <Card style={{ minHeight: 385 }}>
            <CardBody>
              <ASpinner spinning={loading}>
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
                  {t('request_distribution')}
                </ATypography>
                <Tabs type="card" className="mt-5">
                  {distributionList.map((value) => (
                    <Tabs.TabPane tab={value.tabTitle} key={value.key}>
                      {value?.dataChart?.length > 0 ? (
                        value.dataChart.map((item, i) => {
                          return (
                            <ProgressItem
                              key={i}
                              label={item?.[value.itemLabel] === 'UNKNOWN' ? t('all') : item?.[value.itemLabel]}
                              percent={Math.round((item?.totalRequest / requestSummary?.totalRequest || 1) * 100)}
                              total={requestSummary?.totalRequest || 1}
                              value={item?.totalRequest}
                            />
                          );
                        })
                      ) : (
                        <Empty className="mt-5" description={t('no_data')} image={Empty.PRESENTED_IMAGE_SIMPLE} />
                      )}
                    </Tabs.TabPane>
                  ))}
                </Tabs>
              </ASpinner>
            </CardBody>
          </Card>
        </div>
      </div>
    </React.Fragment>
  );
};

export default connect(null, {
  getRequestChart: dashboardActions.getRequestChart,
  getRequestSummary: dashboardActions.getRequestSummary,
  getRequestCategory: dashboardActions.getRequestCategory,
  getRequestCity: dashboardActions.getRequestCity
})(Requests);
