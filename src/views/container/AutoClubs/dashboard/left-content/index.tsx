import React, { useEffect, useState } from 'react';
import { Card } from 'antd/es';
import styled from 'styled-components';
import COLOR from '~/views/utilities/layout/color';
import { useTranslation } from 'react-i18next';
import ChartItemMember from '../members/ChartItem';
import ChartItemRequest from '../requests/ChartItem';
import Distribution from './Distribution';
import { connect } from 'react-redux';
import { dashboardActions } from '~/state/ducks/autoClub/dashboard';

const CardContent = styled.div`
  border-radius: 8px;
  background-color: ${COLOR.White};
  padding: 15px;
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  .title {
    color: ${COLOR.Black};
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
  }
  .ant-card {
    border-radius: 8px;
  }
`;

type Props = {
  params: any;
  getMemberChart: any;
  getRequestChart: any;
  getMemberDistribution: any;
  getMemberSummary: any;
  getRequestSummary: any;
  getRequestCategory: any;
  getRequestCity: any;
};

function LeftContent(props: Props) {
  const { params } = props;
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [dataMemberChart, setDataMemberChart] = useState([]);
  const [dataRequestChart, setDataRequestChart] = useState([]);
  const [dataRequestChartKeys, setDataRequestChartKeys] = useState([]);
  const [userDistribution, setUserDistribution] = useState([]);
  const [memberSummary, setMemberSummary] = useState<any>();
  const [requestSummary, setRequestSummary] = useState<any>();
  const [categoryDistribution, setCategoryDistribution] = useState<any>([]);
  const [cityDistribution, setCityDistribution] = useState<any>([]);

  const fetchData = (action: any, params: any, setData: any, setKeys?: any) => {
    const { timeBy, ...restParams } = params;
    setLoading(true);
    action({ ...restParams })
      .then((res) => {
        setData(res?.content);
        setKeys && setKeys(Object.keys(res?.content[0])?.filter((item) => item !== 'date'));
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('🚀chiendev ~ file: index.tsx:63 ~ fetchData ~ err:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getMemberChart, props.params, setDataMemberChart);
    fetchData(props.getRequestChart, props.params, setDataRequestChart, setDataRequestChartKeys);
    fetchData(props.getMemberSummary, props.params, setMemberSummary);
    fetchData(props.getMemberDistribution, { ...props.params, page: 0, size: 5 }, setUserDistribution);
    fetchData(props.getRequestSummary, props.params, setRequestSummary);
    fetchData(props.getRequestCategory, { ...props.params, page: 0, size: 5 }, setCategoryDistribution);
    fetchData(props.getRequestCity, { ...props.params, page: 0, size: 5 }, setCityDistribution);
  }, [props.params]);

  const distributionList = [
    {
      key: 1,
      tabTitle: t('by_category').toUpperCase(),
      dataChart: userDistribution,
      itemLabel: 'provinceName'
    }
  ];

  const distributionList2 = [
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
    <CardContent>
      <div style={{ marginBottom: '30px', marginTop: '15px' }} className="w-100">
        <span className="title">{t('Statistics_chart').toUpperCase()}</span>
      </div>
      <div className="w-100">
        <ChartItemMember
          label={t('clubMemberChart')}
          data={dataMemberChart}
          position="date*count"
          color="type"
          params={props.params}
          loading={loading}
        />
      </div>

      <div className="w-100">
        <ChartItemRequest
          label={t('requests')}
          data={dataRequestChart}
          keys={dataRequestChartKeys}
          position="date*count"
          color="type"
          params={props.params}
          loading={loading}
        />
      </div>
      <div className="mt-5 row w-100" style={{ minHeight: '500px' }}>
        <div className="col-xl-6 col-12 p-0 pr-lg-1 pr-md-1 pb-10">
          <Distribution
            label={t('user_distribution')}
            summary={memberSummary}
            distributionList={distributionList}
            valueKey={'totalMember'}
          />
        </div>
        <div className="col-xl-6 col-12 p-0 pl-lg-1 pl-md-1 pb-10">
          <Distribution
            label={t('request_distribution')}
            summary={requestSummary}
            distributionList={distributionList2}
            valueKey={'totalRequest'}
          />
        </div>
      </div>
    </CardContent>
  );
}

export default connect(null, {
  getMemberChart: dashboardActions.getMemberChart,
  getRequestChart: dashboardActions.getRequestChart,
  getMemberDistribution: dashboardActions.getMemberDistribution,
  getMemberSummary: dashboardActions.getMemberSummary,
  getRequestSummary: dashboardActions.getRequestSummary,
  getRequestCategory: dashboardActions.getRequestCategory,
  getRequestCity: dashboardActions.getRequestCity
})(LeftContent);
