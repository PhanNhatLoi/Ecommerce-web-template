import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { DEFAULT_AXIS_100, DEFAULT_AXIS_100000 } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carServices/report';
import { RequireParams } from '~/state/ducks/carServices/report/actions';
import BBarChart from '~/views/presentation/ui/chart/BBarChart';

type HorizontalBarChartProps = {
  tab: string;
  params: RequireParams | undefined;
  getServiceChart: any;
  getUserChart: any;
  getGiftChart: any;
  getPromotionChart: any;
};

const HorizontalBarChart: React.FC<HorizontalBarChartProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);
  const [chartData, setChartData] = useState<any>([]);

  const handleGetApi = (tab: string, params: any) => {
    switch (tab) {
      case TABS_REPORT.SERVICE:
        return props.getServiceChart(params);
      case TABS_REPORT.USER:
        return props.getUserChart(params);
      case TABS_REPORT.GIFT_CARD:
        return props.getGiftChart(params);
      case TABS_REPORT.PROMOTION:
        return props.getPromotionChart(params);
      default:
        return;
    }
  };

  useEffect(() => {
    setLoading(true);
    handleGetApi(props.tab, { ...props.params, page: 0, size: 5 })
      .then((res: any) => {
        const response = res?.content;

        setChartData(
          response?.length > 0
            ? response?.sort((a: any, b: any) => b.statisticValue - a.statisticValue)
            : [
                { [props.tab === TABS_REPORT.USER ? 'buyerName' : 'name']: t('no_data'), statisticValue: 0 },
                { statisticValue: props.tab === TABS_REPORT.PROMOTION ? DEFAULT_AXIS_100000 : DEFAULT_AXIS_100 }
              ]
        );
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: HorizontalBarChart.tsx: 30 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, [props.params]);

  const getAliasName = (tab: string) => {
    switch (tab) {
      case TABS_REPORT.SERVICE:
        return t('Booking');
      case TABS_REPORT.USER:
        return t('orders');
      case TABS_REPORT.GIFT_CARD:
        return t('usedQuantity');
      case TABS_REPORT.PROMOTION:
        return t('total_discount');
      default:
        return;
    }
  };

  return (
    <BBarChart
      data={chartData}
      params={props.params}
      yField={[TABS_REPORT.USER].includes(props.tab) ? 'buyerName' : 'name'}
      isPrice={props.tab === TABS_REPORT.PROMOTION}
      alias={getAliasName(props.tab)}
      loading={loading}
    />
  );
};

export default connect(null, {
  getServiceChart: reportActions.getServiceChart,
  getUserChart: reportActions.getUserChart,
  getGiftChart: reportActions.getGiftChart,
  getPromotionChart: reportActions.getPromotionChart
})(HorizontalBarChart);
