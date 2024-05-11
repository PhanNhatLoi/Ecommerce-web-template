import { Row } from 'antd/es';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import SVG from 'react-inlinesvg';
import { connect } from 'react-redux';
import { useHistory } from 'react-router-dom';
import * as PATH from '~/configs/routesConfig';
import { dashboardActions } from '~/state/ducks/autoClub/dashboard';
import { toAbsoluteUrl } from '~/views/utilities/helpers/AssetsHelpers';

import { WrapperStyled } from '..';
import DashboardItem from '../components/DashboardItem';

type AutoClubStatisticProps = {
  params: any;
  getMemberStatistic: any;
  getRequestStatistic: any;
  getHelpStatistic: any;
  getMemberChart: any;
};

const AutoClubStatistic: React.FC<AutoClubStatisticProps> = (props) => {
  const { t }: any = useTranslation();
  const history = useHistory();
  const [loading, setLoading] = useState(false);

  const [memberData, setMemberData] = useState<any>();
  const [requestData, setRequestData] = useState<any>();
  const [helpData, setHelpData] = useState<any>();
  const [memberChart, setMemberChart] = useState<any>([]);

  const fetchData = (action, params, setData) => {
    setLoading(true);
    action({ fromDate: params.fromDate, toDate: params.toDate })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 33 ~ fetchData ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getMemberStatistic, props.params, setMemberData);
    fetchData(props.getRequestStatistic, props.params, setRequestData);
    fetchData(props.getHelpStatistic, props.params, setHelpData);
    fetchData(props.getMemberChart, props.params, setMemberChart);
  }, [props.params]);

  const calculateGrowthPercent = (oldValue: number, newValue: number) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    const percent = Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
    return percent;
  };

  const handleViewAll = () => {
    history.push(PATH.AUTO_CLUB_DASHBOARD_PATH);
  };

  const statisticItem = {
    title: t('members'),
    subTitle: t('new_member'),
    numbers: memberData?.current?.totalMember || 0,
    percent: calculateGrowthPercent(memberData?.previous?.totalMember || 0, memberData?.current?.totalMember || 0),
    prevStatistic: [
      {
        label: t('requests'),
        value: requestData?.current?.totalRequest || 0,
        color: 'text-primary'
      },
      {
        label: t('helps'),
        value: helpData?.current?.totalRepair || 0,
        color: 'text-success'
      },
      {
        label: t('total_members_lowercase'),
        value: memberData?.total?.totalMember || 0,
        color: 'color-grey'
      }
    ],
    viewAll: handleViewAll,
    hasPrevious: true,
    isReverse: true
  };

  const chartItem = {
    label: t('clubMemberChart'),
    tooltipLabel: t('new_members'),
    data: memberChart || []
  };

  return (
    <WrapperStyled>
      <Row>
        <div className="row mx-8 mt-8 mb-2 text-truncate" style={{ fontSize: '16px', fontWeight: 700 }}>
          <SVG src={toAbsoluteUrl('/media/svg/icons/Menu/service.svg')} /> &nbsp;
          {t('Auto Club')}
        </div>
      </Row>

      <DashboardItem
        statisticData={statisticItem}
        chartData={chartItem}
        params={props.params}
        loading={loading}
        isHorizontal={true}
        handleViewAll={handleViewAll}
      />
    </WrapperStyled>
  );
};

export default connect(null, {
  getMemberStatistic: dashboardActions.getMemberStatistic,
  getRequestStatistic: dashboardActions.getRequestStatistic,
  getHelpStatistic: dashboardActions.getHelpStatistic,
  getMemberChart: dashboardActions.getMemberChart
})(AutoClubStatistic);
