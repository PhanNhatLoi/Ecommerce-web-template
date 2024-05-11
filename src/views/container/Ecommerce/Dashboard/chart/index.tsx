import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { dashboardActions } from '~/state/ducks/carAccessories/dashboard';
import { ChartDataResponse } from '~/state/ducks/carAccessories/dashboard/actions';
import NewLineChart from '~/views/presentation/ui/chart/NewLineChart';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import ATypography from '~/views/presentation/ui/text/ATypography';

import { ChartItemProps } from '../Types';

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

type DashboardChartType = {
  params: any;
  getTotalSalesChart: any;
  getNetSalesChart: any;
  getOrdersChart: any;
  getAverageOrderValueChart: any;
};

const DashboardChart: React.FC<DashboardChartType> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);

  const [totalSalesChart, setTotalSalesChart] = useState<ChartDataResponse[]>([]);
  const [netSalesChart, setNetSalesChart] = useState<ChartDataResponse[]>([]);
  const [ordersChart, setOrdersChart] = useState<ChartDataResponse[]>([]);
  const [averageOrderValueChart, setAverageOrderValueChart] = useState<ChartDataResponse[]>([]);

  const fetchData = (params: any, action: any, setData: React.Dispatch<React.SetStateAction<dashboardActions.ChartDataResponse[]>>) => {
    setLoading(true);
    action({
      fromDate: params.fromDate,
      toDate: params.toDate
    })
      .then((res: { content: ChartDataResponse[] }) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('🚀chiendev ~ file: index.tsx:63 ~ fetchData ~ err:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.params, props.getTotalSalesChart, setTotalSalesChart);
    fetchData(props.params, props.getNetSalesChart, setNetSalesChart);
    fetchData(props.params, props.getOrdersChart, setOrdersChart);
    fetchData(props.params, props.getAverageOrderValueChart, setAverageOrderValueChart);
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
              label={props.label}
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
    {
      label: t('total_sales'),
      data: totalSalesChart,
      isPrice: true
    },
    {
      label: t('net_sales'),
      data: netSalesChart,
      isPrice: true
    },
    {
      label: t('Orders'),
      data: ordersChart
    },
    {
      label: t('average_order_value'),
      data: averageOrderValueChart,
      isPrice: true
    }
  ];

  return (
    <div className="w-100">
      {chartList.map((item) => (
        <div className="mb-10">
          <ChartItem label={item.label} data={item.data} isPrice={item.isPrice} position="date*count" color="type" params={props.params} />
        </div>
      ))}
    </div>
  );
};

export default connect(null, {
  getTotalSalesChart: dashboardActions.getTotalSalesChart,
  getNetSalesChart: dashboardActions.getNetSalesChart,
  getOrdersChart: dashboardActions.getOrdersChart,
  getAverageOrderValueChart: dashboardActions.getAverageOrderValueChart
})(DashboardChart);
