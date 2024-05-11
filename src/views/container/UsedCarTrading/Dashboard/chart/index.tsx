import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { ChartDataResponse } from '~/state/ducks/carAccessories/dashboard/actions';
import { dashboardActions } from '~/state/ducks/usedCarTrading/dashboard';
import MultiLineChart from '~/views/presentation/ui/chart/MultiLineChart';
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
  getPostChart: any;
  getViewChart: any;
};

const DashboardChart: React.FC<DashboardChartType> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);

  const [postChart, sePostChart] = useState<any>([]);
  const [postChartKeys, sePostChartKeys] = useState<any[]>([]);

  const [viewChart, setViewChart] = useState<any>([]);
  const [viewChartKeys, setViewChartKeys] = useState<any[]>([]);

  const fetchData = (params: any, action: any, setData: any, setKeys: any) => {
    setLoading(true);
    action({
      fromDate: params.fromDate,
      toDate: params.toDate
    })
      .then((res: { content: ChartDataResponse[] }) => {
        setData(res?.content);
        setKeys(Object.keys(res?.content[0])?.filter((item) => item !== 'date'));
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('🚀chiendev ~ file: index.tsx:63 ~ fetchData ~ err:', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.params, props.getPostChart, sePostChart, sePostChartKeys);
    fetchData(props.params, props.getViewChart, setViewChart, setViewChartKeys);
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
            <MultiLineChart
              data={props.data}
              keys={props.keys}
              params={props.params}
              label={props.label}
              position={props.position}
              color={props.color}
              xAxis="date"
              showLegend
            />
          </LineChartWrapperStyled>
        </ASpinner>
      </BodyStyled>
    );
  };

  const chartList = [
    {
      label: t('carTradingChart'),
      data: postChart,
      keys: postChartKeys
    },
    {
      label: t('viewsChart'),
      data: viewChart,
      keys: viewChartKeys
    }
  ];

  return (
    <div className="row w-100">
      {chartList.map((item) => (
        <div className="col-12 col-lg-6">
          <ChartItem label={item.label} data={item.data} keys={item.keys} position="date*count" color="type" params={props.params} />
        </div>
      ))}
    </div>
  );
};

export default connect(null, {
  getPostChart: dashboardActions.getPostChart,
  getViewChart: dashboardActions.getViewChart
})(DashboardChart);
