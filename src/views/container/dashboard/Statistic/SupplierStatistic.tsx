import { Col, Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { dashboardActions } from '~/state/ducks/carAccessories/dashboard';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

import { WrapperStyled } from '..';
import DashboardItem from '../components/DashboardItem';

type SupplierStatisticProps = {
  params: any;
  getOrderStatistics: any;
  getRevenueStatistics: any;
  getOrdersChart: any;
  getRevenueChart: any;
};

const SupplierStatistic: React.FC<SupplierStatisticProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();

  const [loading, setLoading] = useState(false);

  const [orderStatisticData, setOrderStatisticData] = useState<any>();
  const [revenueStatisticData, setRevenueStatisticData] = useState<any>();
  const [orderChart, setOrderChart] = useState<any>([]);
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
    fetchData(props.getOrderStatistics, props.params, setOrderStatisticData);
    fetchData(props.getRevenueStatistics, props.params, setRevenueStatisticData);
    fetchData(props.getOrdersChart, props.params, setOrderChart);
    fetchData(props.getRevenueChart, props.params, setRevenueChart);
  }, [props.params]);

  const calculateGrowthPercent = (oldValue: number, newValue: number) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const handleViewAll = () => {
    history.push(PATH.CAR_ACCESSORIES_DASHBOARD_PATH);
  };

  const supplierItem = [
    {
      statistic: {
        title: t('orders'),
        subTitle: t('newOrder'),
        numbers: orderStatisticData?.current?.totalOrder || 0,
        percent: calculateGrowthPercent(orderStatisticData?.previous?.totalOrder || 0, orderStatisticData?.current?.totalOrder || 0),
        currentStatistic: [
          {
            label: t('new'),
            value: orderStatisticData?.current?.totalNew || 0,
            color: 'text-primary'
          },
          {
            label: t('SHIPPING'),
            value: orderStatisticData?.current?.totalProcessing || 0,
            color: 'text-warning'
          },
          {
            label: t('Done'),
            value: orderStatisticData?.current?.totalDone || 0,
            color: 'text-success'
          },
          {
            label: t('cancel'),
            value: orderStatisticData?.current?.totalCanceled || 0,
            color: 'text-danger'
          }
        ],
        prevStatistic: [
          {
            label: t('prev_period'),
            value: orderStatisticData?.previous?.totalOrder || 0,
            color: 'color-grey'
          },
          {
            label: t('total_order'),
            value: orderStatisticData?.total?.totalOrder || 0,
            color: 'color-grey'
          }
        ],
        viewAll: handleViewAll,
        hasCurrent: true,
        hasPrevious: true
      },
      chart: {
        label: t('orderChart'),
        tooltipLabel: t('orders_quantity'),
        data: orderChart || []
      }
    },
    {
      statistic: {
        title: t('revenue'),
        subTitle: t('revenue'),
        numbers: revenueStatisticData?.current?.totalRevenue || 0,
        percent: calculateGrowthPercent(
          revenueStatisticData?.previous?.totalRevenue || 0,
          revenueStatisticData?.current?.totalRevenue || 0
        ),
        prevStatistic: [
          {
            label: t('prev_period'),
            value: revenueStatisticData?.previous?.totalRevenue || 0,
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
          <SVG src={toAbsoluteUrl('/media/svg/icons/Menu/ecome.svg')} /> &nbsp;
          {t('supplier')}
        </div>
      </Row>
      <Row>
        {supplierItem.map((item) => (
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
  getOrderStatistics: dashboardActions.getOrderStatistics,
  getRevenueStatistics: dashboardActions.getStatistics,
  getOrdersChart: dashboardActions.getOrdersChart,
  getRevenueChart: dashboardActions.getRevenueChart
})(SupplierStatistic);
