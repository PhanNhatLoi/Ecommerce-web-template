import { Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { dashboardActions } from '~/state/ducks/insurance/dashboard';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

import { WrapperStyled } from '..';
import DashboardItem from '../components/DashboardItem';

type InsuranceStatisticProps = { params: any; getInsuranceContractStatistic: any; getInsuranceContractChart: any };

const InsuranceStatistic: React.FC<InsuranceStatisticProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [statisticData, setStatisticData] = useState<any>();
  const [chartData, setChartData] = useState([]);

  const fetchData = (action, params, setData) => {
    setLoading(true);
    action({ fromDate: params.fromDate, toDate: params.toDate })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 33 ~ fetchData ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getInsuranceContractStatistic, props.params, setStatisticData);
    fetchData(props.getInsuranceContractChart, props.params, setChartData);
  }, []);

  const calculateGrowthPercent = (oldValue: number, newValue: number) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const handleViewAll = () => {
    history.push(PATH.INSURANCE_DASHBOARD_PATH);
  };

  const statisticItem = {
    title: t('contract'),
    subTitle: t('newContract'),
    numbers: statisticData?.current?.totalOrder || 0,
    percent: calculateGrowthPercent(statisticData?.previous?.totalOrder || 0, statisticData?.current?.totalOrder || 0),
    currentStatistic: [
      {
        label: t('done'),
        value: statisticData?.current?.totalDone || 0,
        color: 'text-primary'
      },
      {
        label: t('waiting_approval'),
        value: statisticData?.current?.totalProcessing || 0,
        color: 'text-warning'
      }
    ],
    prevStatistic: [
      {
        label: t('prev_period'),
        value: statisticData?.previous?.totalOrder || 0,
        color: 'color-grey'
      },
      {
        label: t('total_contracts'),
        value: statisticData?.total?.totalOrder || 0,
        color: 'color-grey'
      }
    ],
    viewAll: handleViewAll,
    hasCurrent: true,
    hasPrevious: true
  };

  const chartItem = {
    label: t('insuranceContractChart'),
    tooltipLabel: t('insuranceContractQuantity'),
    data: chartData || []
  };

  return (
    <WrapperStyled>
      <Row>
        <div className="row mx-8 mt-8 mb-2 text-truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
          <SVG src={toAbsoluteUrl('/media/svg/icons/Menu/shield.svg')} /> &nbsp;
          {t('insurance')}
        </div>
      </Row>

      <DashboardItem
        statisticData={statisticItem}
        chartData={chartItem}
        params={props.params}
        loading={loading}
        isHorizontal={true}
        handleViewAll={handleViewAll}
      />
    </WrapperStyled>
  );
};

export default connect(null, {
  getInsuranceContractStatistic: dashboardActions.getInsuranceContractStatistic,
  getInsuranceContractChart: dashboardActions.getInsuranceContractChart
})(InsuranceStatistic);
