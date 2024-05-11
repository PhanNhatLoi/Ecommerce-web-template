import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { ORDER_TYPE, TYPOGRAPHY_TYPE } from '~/configs';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { dashboardActions } from '~/state/ducks/insurance/dashboard';
import EmptyLineChart from '~/views/presentation/ui/chart/EmptyLineChart';
import PieChart from '~/views/presentation/ui/chart/PieChart';
import ATypography from '~/views/presentation/ui/text/ATypography';

type DashboardChartType = {
  getProductChart: any;
  getOrderChart: any;
  params: any;
};
const BodyStyled = styled.div`
  border-radius: 8px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  background: #fcfcfc;
  padding: 15px;
`;

const DashboardChart: React.FC<DashboardChartType> = (props) => {
  const { t }: any = useTranslation();
  const [revenueChart, setRevenueChart] = useState<any[]>([]);
  const [orderChart, setOrderChart] = useState<any>();
  const [totalRevenue, setTotalRevenue] = useState(0);

  const fetchData = (action: any, params: any, setData: any) => {
    action({ fromDate: props.params?.fromDate, toDate: props.params?.toDate, ...params })
      .then((res: { content: any }) => {
        setData(res?.content || []);
        if (params)
          setTotalRevenue(
            res?.content?.reduce((acc, item) => {
              return acc + item.revenue;
            }, 0)
          );
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: index.tsx: 44 ~ fetchData ~ err', err);
      });
  };

  useEffect(() => {
    fetchData(props.getProductChart, { type: ORDER_TYPE.INSURANCE }, setRevenueChart);
    fetchData(props.getOrderChart, undefined, setOrderChart);
  }, [props.params]);

  const generateData = (labels, data) => {
    return labels.map((label, i) => {
      return {
        item: label,
        percent: data[i]
      };
    });
  };

  const ChartItem: any = (props) => {
    return (
      // <BCard>
      //   <CardBody>
      <BodyStyled>
        <div className="mb-15">
          <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4}>
            {t(props.label)}
          </ATypography>
        </div>
        {props.dataChart?.length > 0 ? (
          <PieChart data={props.dataChart} />
        ) : (
          <div className="d-flex flex-column align-items-center text-start">
            <EmptyLineChart data={props.dataChart} position={props.position} color={props.color} />
          </div>
        )}
      </BodyStyled>
      //   </CardBody>
      // </BCard>
    );
  };

  const chartList = [
    {
      label: t('revenue_package'),
      dataChart: generateData(
        revenueChart.map((val) => val.productName),
        revenueChart.map((val) => {
          return Math.round((val?.revenue / totalRevenue) * 100);
        })
      )
    },
    {
      label: t('orders'),
      dataChart: generateData(
        ['totalSuccess', 'totalWaitingPayment', 'totalCancel'],
        [orderChart?.totalSuccess || 0, orderChart?.totalWaitingPayment || 0, orderChart?.totalCancel || 0].map((val) => {
          return Math.round((val / (orderChart?.totalSuccess + orderChart?.totalWaitingPayment + orderChart?.totalCancel)) * 100);
        })
      )
    }
  ];

  return (
    <div className="w-100">
      {chartList.map((item) => (
        <div className="mb-10">
          <ChartItem //
            label={item.label}
            dataChart={item.dataChart}
          />
        </div>
      ))}
    </div>
  );
};

export default connect(null, {
  getProductChart: reportActions.getProductChart,
  getOrderChart: dashboardActions.getOrderChart
})(DashboardChart);
