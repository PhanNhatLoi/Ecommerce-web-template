import { DollarCircleOutlined, FileOutlined, ToolOutlined, UserOutlined } from '@ant-design/icons';
import { Skeleton } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { TYPOGRAPHY_TYPE } from '~/configs';
import { TABS_REPORT } from '~/configs/const';
import { reportActions } from '~/state/ducks/carServices/report';
import { RequireParams, StatisticsResponse } from '~/state/ducks/carServices/report/actions';
import ATypography from '~/views/presentation/ui/text/ATypography';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type StatisticListProps = {
  tab: string;
  params: RequireParams | undefined;
  getRevenueStatistic: any;
  getServiceStatistic: any;
  getUserStatistic: any;
  getGiftStatistic: any;
  getPromotionStatistic: any;
};

const StatisticList: React.FC<StatisticListProps> = (props) => {
  const { t }: any = useTranslation();
  const [loading, setLoading] = useState(false);
  const [statisticData, setStatisticData] = useState<StatisticsResponse>();

  useEffect(() => {
    setLoading(true);
    handleGetApi(props.tab, props?.params)
      .then((res: { content: StatisticsResponse }) => {
        setStatisticData(res?.content);
        setLoading(false);
      })
      .catch((err: any) => {
        console.error('chiendev ~ file: StatisticList.tsx: 32 ~ useEffect ~ err', err);
        setLoading(false);
      });
  }, [props.params]);

  const handleGetApi = (tab: string, params: RequireParams | undefined) => {
    switch (tab) {
      case TABS_REPORT.REVENUE:
        return props.getRevenueStatistic(params);
      case TABS_REPORT.SERVICE:
        return props.getServiceStatistic(params);
      case TABS_REPORT.USER:
        return props.getUserStatistic(params);
      case TABS_REPORT.GIFT_CARD:
        return props.getGiftStatistic(params);
      case TABS_REPORT.PROMOTION:
        return props.getPromotionStatistic(params);
      default:
        return;
    }
  };

  const dataStatistic = [
    {
      icon: <DollarCircleOutlined />,
      value: numberFormatDecimal(statisticData?.revenue || 0, ' đ', ''),
      text: t('revenue')
    },
    {
      icon: <FileOutlined />,
      value: numberFormatDecimal(statisticData?.totalOrder || 0),
      text: t('orders')
    },
    {
      icon: <ToolOutlined />,
      value: numberFormatDecimal(statisticData?.booking || 0),
      text: t('Booking')
    },
    {
      icon: <UserOutlined />,
      value: numberFormatDecimal(statisticData?.ecaUser || 0),
      text: t('userBooking')
    }
  ];

  return (
    <div className="row justify-content-between">
      <Skeleton active loading={loading}>
        {dataStatistic.map((data) => {
          return (
            <div className="col-xl-auto col-lg-6 col-md-6 col-sm-6 d-flex align-items-center my-4">
              <div className="py-3 pr-3 d-flex align-items-center" style={{ fontSize: '40px' }}>
                {data.icon}
              </div>
              <div>
                <ATypography variant={TYPOGRAPHY_TYPE.TITLE} level={3} className="mb-0">
                  {data.value}
                </ATypography>
                <span style={{ fontSize: '15px' }}>{data.text}</span>
              </div>
            </div>
          );
        })}
      </Skeleton>
    </div>
  );
};

export default connect(null, {
  getRevenueStatistic: reportActions.getRevenueStatistic,
  getServiceStatistic: reportActions.getServiceStatistic,
  getUserStatistic: reportActions.getUserStatistic,
  getGiftStatistic: reportActions.getGiftStatistic,
  getPromotionStatistic: reportActions.getPromotionStatistic
})(StatisticList);
