import { DollarCircleOutlined, FileOutlined, HeartOutlined, UserOutlined } from '@ant-design/icons';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { ORDER_TYPE, TYPOGRAPHY_TYPE } from '~/configs';
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
  getCustomerStatistic: any;
};

const StatisticList: React.FC<StatisticListProps> = (props) => {
  const { t }: any = useTranslation();
  const [statisticData, setStatisticData] = useState<StatisticsResponse>();

  useEffect(() => {
    handleGetApi(props.tab, { ...props?.params, type: ORDER_TYPE.INSURANCE })
      .then((res: { content: StatisticsResponse }) => {
        const response = res?.content;
        setStatisticData(response);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: StatisticList.tsx: 32 ~ useEffect ~ err', err);
      });
  }, [props.params]);

  const handleGetApi = (tab: string, params: any) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getOrderStatistic(params);
      case TABS_REPORT.ORDER:
        return props.getOrderStatistic(params);
      case TABS_REPORT.CUSTOMER:
        return props.getOrderStatistic(params);
      case TABS_REPORT.PACKAGE:
        return props.getOrderStatistic(params);
      default:
        return;
    }
  };

  const dataStatistic = [
    {
      icon: <DollarCircleOutlined />,
      value: numberFormatDecimal(statisticData?.totalRevenue || 0, ' đ', ''),
      text: t('revenue')
    },
    {
      icon: <FileOutlined />,
      value: numberFormatDecimal(statisticData?.totalOrder || 0, '', ''),
      text: t('Orders')
    },
    {
      icon: <UserOutlined />,
      value: numberFormatDecimal(statisticData?.totalCustomer || 0, '', ''),
      text: t('customers')
    },
    {
      icon: <HeartOutlined />,
      value: numberFormatDecimal(statisticData?.totalProduct || 0, '', ''),
      text: t('package_insurance')
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
  getCustomerStatistic: reportActions.getCustomerStatistic
})(StatisticList);
