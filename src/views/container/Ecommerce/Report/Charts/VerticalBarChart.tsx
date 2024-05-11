import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { RequireParams, VerticalBarChartDataResponse } from '~/state/ducks/carAccessories/report/actions';
import BColumnChart from '~/views/presentation/ui/chart/BColumnChart';

type VerticalBarChartProps = {
  label: string;
  tab: string;
  dateType: string;
  params?: RequireParams;
  getRevenueChart: any;
  getOrderChart: any;
  getShippingChart: any;
};

const VerticalBarChart: React.FC<VerticalBarChartProps> = (props) => {
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<VerticalBarChartDataResponse[]>([]);

  const handleGetApi = (tab: string, params: RequireParams | undefined) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getRevenueChart(params);
      case TABS_REPORT.ORDER:
        return props.getOrderChart(params);
      case TABS_REPORT.SHIPPING:
        return props.getShippingChart(params);
      default:
        return;
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetApi(props.tab, props.params)
      .then((res: { content: VerticalBarChartDataResponse[] }) => {
        setChartData(res?.content);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: VerticalBarChart.tsx: 37 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, [props.params]);

  return (
    <BColumnChart
      data={chartData}
      alias={props.label}
      dateType={props.dateType}
      params={props.params}
      isPrice={props.tab === TABS_REPORT.REVENUE}
      loading={loading}
    />
  );
};

export default connect(null, {
  getRevenueChart: reportActions.getRevenueChart,
  getOrderChart: reportActions.getOrderChart,
  getShippingChart: reportActions.getShippingChart
})(VerticalBarChart);
