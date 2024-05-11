import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/carServices/dashboard';
import { ChartItemProps } from '~/views/container/Ecommerce/Dashboard/Types';
import NewLineChart from '~/views/presentation/ui/chart/NewLineChart';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';
import COLOR from '~/views/utilities/layout/color';

import PickupTable from '../table/PickupTable';

export const LineChartWrapperStyled = styled.div`
  overflow-x: auto;
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
    border-radius: 5px;
    background-color: #f5f5f5;
  }
  &::-webkit-scrollbar-thumb {
    border-radius: 5px;
    background: #e1e1e1;
  }
`;
const BodyStyled = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fcfcfc;
  padding: 15px;
`;

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

type DashboardChartProps = { params: any; getRevenueChart: any; getOrderChart: any; getRequestChart: any };

const DashboardChart: React.FC<DashboardChartProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);

  const [revenueChart, setRevenueChart] = useState<any>([]);
  const [orderChart, setOrderChart] = useState<any>([]);
  const [requestChart, setRequestChart] = useState<any>([]);

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
    fetchData(props.getRevenueChart, props.params, setRevenueChart);
    fetchData(props.getOrderChart, props.params, setOrderChart);
    fetchData(props.getRequestChart, props.params, setRequestChart);
  }, [props.params]);

  const ChartItem: React.FC<ChartItemProps> = (props) => {
    return (
      <BodyStyled>
        <ASpinner spinning={loading}>
          <div className="mb-15">
            <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
              {t(props.label)}
            </ATypography>
          </div>
          <LineChartWrapperStyled>
            <NewLineChart
              data={props.data}
              params={props.params}
              label={props.tooltipLabel}
              position={props.position}
              color={props.color}
              isPrice={props.isPrice}
              xAxis="date"
            />
          </LineChartWrapperStyled>
        </ASpinner>
      </BodyStyled>
    );
  };

  const chartList = [
    { label: t('revenueChart'), data: revenueChart, tooltipLabel: t('revenue'), isPrice: true },
    { label: t('orderChart'), data: orderChart, tooltipLabel: t('orders') },
    { label: t('bookingChart'), data: requestChart, tooltipLabel: t('Booking') }
  ];

  return (
    <CardContent>
      <div style={{ marginBottom: '30px', marginTop: '15px' }} className="w-100">
        <span className="title">{t('Statistics_chart').toUpperCase()}</span>
      </div>
      {chartList.map((item) => (
        <div className="col-12 p-0 mb-10">
          <ChartItem
            label={item.label}
            data={item.data}
            isPrice={item.isPrice}
            tooltipLabel={item.tooltipLabel}
            position="date*count"
            color="type"
            params={props.params}
          />
        </div>
      ))}

      <div className="col-12 p-0">
        <PickupTable />
      </div>
    </CardContent>
  );
};

export default connect(null, {
  getRevenueChart: dashboardActions.getRevenueChart,
  getOrderChart: dashboardActions.getOrderChart,
  getRequestChart: dashboardActions.getRequestChart
})(DashboardChart);
