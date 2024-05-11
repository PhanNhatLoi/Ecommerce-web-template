import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AXIS_10 } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { CustomerChartResponse, ProductChartResponse, RequireParams } from '~/state/ducks/carAccessories/report/actions';
import BBarChart from '~/views/presentation/ui/chart/BBarChart';

type HorizontalBarChartProps = {
  tab: string;
  params?: RequireParams;
  getProductChart: any;
  getCustomerChart: any;
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<ProductChartResponse[] | CustomerChartResponse[]>([]);

  const handleGetApi = (tab: string, params: RequireParams | undefined) => {
    return tab === TABS_REPORT.PRODUCT ? props.getProductChart(params) : props.getCustomerChart(params);
  };

  useEffect(() => {
    setLoading(true);
    handleGetApi(props.tab, props.params)
      .then((res: { content: ProductChartResponse[] | CustomerChartResponse[] }) => {
        const response = res?.content;

        setChartData(
          response?.length > 0
            ? res?.content?.sort((a: any, b: any) => b.statisticValue - a.statisticValue)
            : [
                { [props.tab === TABS_REPORT.PRODUCT ? 'productName' : 'buyerName']: t('no_data'), statisticValue: 0 },
                { statisticValue: DEFAULT_AXIS_10 }
              ]
        );
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: HorizontalBarChart.tsx: 29 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, [props.params]);

  return (
    <BBarChart
      data={chartData}
      params={props.params}
      yField={[TABS_REPORT.PRODUCT].includes(props.tab) ? 'productName' : 'buyerName'}
      isPrice={props.tab !== TABS_REPORT.PRODUCT}
      alias={props.tab === TABS_REPORT.PRODUCT ? t('sale_quantity') : t('revenue')}
      loading={loading}
    />
  );
};

export default connect(null, {
  getProductChart: reportActions.getProductChart,
  getCustomerChart: reportActions.getCustomerChart
})(HorizontalBarChart);
