import { Col, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { dashboardActions } from '~/state/ducks/carServices/dashboard';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

import { WrapperStyled } from '..';
import DashboardItem from '../components/DashboardItem';

type GarageStatisticProps = { params: any; getRequestStatistic: any; getRevenueStatistic: any; getRequestChart: any; getRevenueChart: any };

const GarageStatistic: React.FC<GarageStatisticProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [requestStatistic, setRequestStatistic] = useState<any>();
  const [revenueStatistic, setRevenueStatistic] = useState<any>();
  const [requestChart, setRequestChart] = useState<any>([]);
  const [revenueChart, setRevenueChart] = useState<any>([]);

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
    fetchData(props.getRequestStatistic, props.params, setRequestStatistic);
    fetchData(props.getRevenueStatistic, props.params, setRevenueStatistic);
    fetchData(props.getRequestChart, props.params, setRequestChart);
    fetchData(props.getRevenueChart, props.params, setRevenueChart);
  }, [props.params]);

  const calculateGrowthPercent = (oldValue: number, newValue: number) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const handleViewAll = () => {
    history.push(PATH.CAR_SERVICES_DASHBOARD_PATH);
  };

  const garageItem = [
    {
      statistic: {
        title: t('requests'),
        subTitle: t('new_requests'),
        numbers: requestStatistic?.current?.totalRequest || 0,
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
          },
          {
            label: t('cancel'),
            value: requestStatistic?.current?.totalCanceled || 0,
            color: 'text-danger'
          }
        ],
        prevStatistic: [
          {
            label: t('prev_period'),
            value: requestStatistic?.previous?.totalRequest || 0,
            color: 'color-grey'
          },
          {
            label: t('total_requests'),
            value: requestStatistic?.total?.totalRequest || 0,
            color: 'color-grey'
          }
        ],
        viewAll: handleViewAll,
        hasCurrent: true,
        hasPrevious: true
      },
      chart: {
        label: t('bookingChart'),
        tooltipLabel: t('booking_quantity'),
        data: requestChart || []
      }
    },
    {
      statistic: {
        title: t('revenue'),
        subTitle: t('revenue'),
        numbers: revenueStatistic?.current?.totalRevenue || 0,
        percent: calculateGrowthPercent(revenueStatistic?.previous?.totalRevenue || 0, revenueStatistic?.current?.totalRevenue || 0),
        prevStatistic: [
          {
            label: t('prev_period'),
            value: revenueStatistic?.previous?.totalRevenue || 0,
            color: 'color-grey'
          }
        ],
        viewAll: handleViewAll,
        hasPrevious: true,
        isPrice: true,
        noDivider: true
      },
      chart: {
        label: t('revenueChart'),
        tooltipLabel: t('revenue'),
        data: revenueChart || [],
        isPrice: true
      }
    }
  ];

  return (
    <WrapperStyled>
      <Row>
        <div className="mx-8 mt-8 mb-2 text-truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
          <SVG src={toAbsoluteUrl('/media/svg/icons/Menu/car.svg')} /> &nbsp;
          {t('GARAGE')}
        </div>
      </Row>
      <Row>
        {garageItem.map((item) => (
          <Col xs={24} sm={24} md={24} lg={24} xl={24} xxl={12}>
            <DashboardItem
              statisticData={item.statistic}
              chartData={item.chart}
              params={props.params}
              loading={loading}
              handleViewAll={handleViewAll}
            />
          </Col>
        ))}
      </Row>
    </WrapperStyled>
  );
};

export default connect(null, {
  getRequestStatistic: dashboardActions.getRequestStatistic,
  getRevenueStatistic: dashboardActions.getRevenueStatistic,
  getRequestChart: dashboardActions.getRequestChart,
  getRevenueChart: dashboardActions.getRevenueChart
})(GarageStatistic);
