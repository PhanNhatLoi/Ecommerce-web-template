import { DollarCircleOutlined, FileOutlined, ShoppingCartOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carAccessories/report';
import { RequireParams, StatisticsResponse } from '~/state/ducks/carAccessories/report/actions';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type StatisticListProps = {
  tab: string;
  params?: RequireParams;
  getRevenueStatistic: any;
  getOrderStatistic: any;
  getProductStatistic: any;
  getShippingStatistic: any;
  getCustomerStatistic: any;
};

const StatisticList: React.FC<StatisticListProps> = (props) => {
  const { t }: any = useTranslation();
  const [statisticData, setStatisticData] = useState<StatisticsResponse>();

  useEffect(() => {
    handleGetApi(props.tab, props?.params)
      .then((res: { content: StatisticsResponse }) => {
        const response = res?.content;
        setStatisticData(response);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: StatisticList.tsx: 32 ~ useEffect ~ err', err);
      });
  }, [props.params]);

  const handleGetApi = (tab: string, params: RequireParams | undefined) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getOrderStatistic(params);
      case TABS_REPORT.ORDER:
        return props.getOrderStatistic(params);
      case TABS_REPORT.PRODUCT:
        return props.getOrderStatistic(params);
      case TABS_REPORT.SHIPPING:
        return props.getOrderStatistic(params);
      case TABS_REPORT.CUSTOMER:
        return props.getOrderStatistic(params);
      default:
        return;
    }
  };

  const dataStatistic = [
    {
      icon: <DollarCircleOutlined />,
      value: numberFormatDecimal(statisticData?.totalRevenue, ' đ', ''),
      text: t('revenue')
    },
    {
      icon: <FileOutlined />,
      value: numberFormatDecimal(statisticData?.totalOrder),
      text: t('Orders')
    },
    {
      icon: <ShoppingCartOutlined />,
      value: numberFormatDecimal(statisticData?.totalProduct),
      text: t('Products')
    },
    {
      icon: <DollarCircleOutlined />,
      value: numberFormatDecimal(statisticData?.totalShippingFee, ' đ', ''),
      text: t('shipping_cost')
    },
    {
      icon: <UserOutlined />,
      value: numberFormatDecimal(statisticData?.totalCustomer),
      text: t('customers')
    }
  ];

  return (
    <div className="row justify-content-between">
      {dataStatistic.map((data) => {
        return (
          <div className="col-xl-auto col-lg-6 col-md-6 col-sm-6 d-flex align-items-center my-4">
            <div className="display-4 py-3 pr-3 d-flex justify-content-center align-items-center">{data.icon}</div>
            <div>
              <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={4} className="mb-0">
                {data.value}
              </ATypography>
              <span>{data.text}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default connect(null, {
  getRevenueStatistic: reportActions.getRevenueStatistic,
  getOrderStatistic: reportActions.getOrderStatistic,
  getProductStatistic: reportActions.getProductStatistic,
  getShippingStatistic: reportActions.getShippingStatistic,
  getCustomerStatistic: reportActions.getCustomerStatistic
})(StatisticList);
