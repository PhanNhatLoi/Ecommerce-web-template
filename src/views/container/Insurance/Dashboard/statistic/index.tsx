import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ORDER_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/carAccessories/dashboard';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import UIStatisticVer2 from '~/views/presentation/ui/statistic/NewUIStatisticVer2';
import COLOR from '~/views/utilities/layout/color';

const RightContent = styled.div`
  border-radius: 8px;
  width: 100%;
  background-color: ${COLOR.White};
  padding-bottom: 25px;
  height: 100%;
  .title {
    color: ${COLOR.Black};
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 15px;
    padding-top: 30px;
    padding-bottom: 30px;
    width: 100%;
  }
`;

type DashboardStatisticProps = {
  getStatistics: any;
  params: any;
};

const DashboardStatistic: React.FC<DashboardStatisticProps> = (props) => {
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [statisticData, setStatisticData] = useState<any>();

  useEffect(() => {
    setLoading(true);
    props
      .getStatistics({
        fromDate: props.params?.fromDate,
        toDate: props.params?.toDate,
        type: ORDER_TYPE.INSURANCE
      })
      .then((res: { content: any }) => {
        setStatisticData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('chiendev ~ file: index.tsx: 28 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, [props.params]);

  const calculateGrowthPercent = (oldValue: number, newValue: number) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const statisticList = [
    {
      subTitle: t('revenue'),
      numbers: statisticData?.current?.totalRevenue || 0,
      percent: calculateGrowthPercent(statisticData?.previous?.totalRevenue || 0, statisticData?.current?.totalRevenue || 0),
      hasPrevious: true,
      isPrice: true,
      prevStatistic: [
        {
          label: t('prev_period'),
          value: statisticData?.previous?.totalRevenue || 0,
          color: 'color-grey'
        }
      ]
    },
    {
      subTitle: t('orders'),
      numbers: statisticData?.current?.totalOrders || 0,
      percent: calculateGrowthPercent(statisticData?.previous?.totalOrders || 0, statisticData?.current?.totalOrders || 0),
      hasPrevious: true,
      prevStatistic: [
        {
          label: t('prev_period'),
          value: statisticData?.previous?.totalOrders || 0,
          color: 'color-grey'
        }
      ]
    }
  ];

  return (
    <RightContent>
      <div className="title">
        <span>{t('statistics').toUpperCase()}</span>
      </div>
      {statisticList.map((item, index) => (
        <ASpinner spinning={loading}>
          <UIStatisticVer2 data={item} index={index} />
        </ASpinner>
      ))}
    </RightContent>
  );
};

export default connect(null, {
  getStatistics: dashboardActions.getStatistics
})(DashboardStatistic);
