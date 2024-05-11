import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { dashboardActions } from '~/state/ducks/carServices/dashboard';
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

type DashboardStatisticProps = { params: any; getRequestStatistic: any; getRevenueStatistic: any; getOrderStatistic: any };

const DashboardStatistic: React.FC<DashboardStatisticProps> = (props) => {
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [requestStatistic, setRequestStatistic] = useState<any>([]);
  const [revenueStatistic, setRevenueStatistic] = useState<any>([]);
  const [orderStatistic, setOrderStatistic] = useState<any>([]);

  const fetchData = (action, params, setData) => {
    setLoading(true);
    action({ fromDate: params.fromDate, toDate: params.toDate })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 17 ~ fetchData ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getRevenueStatistic, props.params, setRevenueStatistic);
    fetchData(props.getOrderStatistic, props.params, setOrderStatistic);
    fetchData(props.getRequestStatistic, props.params, setRequestStatistic);
  }, [props.params]);

  const calculateGrowthPercent = (oldValue, newValue) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const statisticList = [
    {
      subTitle: t('revenue'),
      totalTitle: t('total_revenue'),
      numbers: revenueStatistic?.current?.totalRevenue || 0,
      totalNumbers: revenueStatistic?.total?.totalRevenue || 0,
      percent: calculateGrowthPercent(revenueStatistic?.previous?.totalRevenue || 0, revenueStatistic?.current?.totalRevenue || 0),
      prevStatistic: [
        {
          label: t('prev_period'),
          value: revenueStatistic?.previous?.totalRevenue || 0,
          color: 'color-grey'
        }
      ],
      hasPrevious: true,
      hasTotal: true,
      isPrice: true
    },
    {
      subTitle: t('orders'),
      totalTitle: t('total_order'),
      numbers: orderStatistic?.current?.totalOrder || 0,
      totalNumbers: orderStatistic?.total?.totalOrder || 0,
      percent: calculateGrowthPercent(orderStatistic?.previous?.totalOrder || 0, orderStatistic?.current?.totalOrder || 0),
      prevStatistic: [
        {
          label: t('prev_period'),
          value: orderStatistic?.previous?.totalOrder || 0,
          color: 'color-grey'
        }
      ],
      hasPrevious: true,
      hasTotal: true
    },
    {
      subTitle: t('requests'),
      totalTitle: t('total_requests'),
      numbers: requestStatistic?.current?.totalRequest || 0,
      totalNumbers: requestStatistic?.total?.totalRequest || 0,
      percent: calculateGrowthPercent(requestStatistic?.previous?.totalRequest || 0, requestStatistic?.current?.totalRequest || 0),
      currentStatistic: [
        {
          label: t('new'),
          value: requestStatistic?.current?.totalNew || 0,
          color: 'text-primary'
        },
        {
          label: t('fixing'),
          value: requestStatistic?.current?.totalFixing || 0,
          color: 'text-warning'
        },
        {
          label: t('Done'),
          value: requestStatistic?.current?.totalFixed || 0,
          color: 'text-success'
        }
      ],
      prevStatistic: [
        {
          label: t('prev_period'),
          value: requestStatistic?.previous?.totalRequest || 0,
          color: 'color-grey'
        }
      ],
      hasPrevious: true,
      hasTotal: true
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
  getOrderStatistic: dashboardActions.getOrderStatistic,
  getRequestStatistic: dashboardActions.getRequestStatistic,
  getRevenueStatistic: dashboardActions.getRevenueStatistic
})(DashboardStatistic);
