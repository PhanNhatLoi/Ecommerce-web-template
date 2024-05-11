import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { dashboardActions } from '~/state/ducks/autoClub/dashboard';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import UIStatisticVer2 from '~/views/presentation/ui/statistic/NewUIStatisticVer2';
import COLOR from '~/views/utilities/layout/color';

const RightContent = styled.div`
  border-radius: 8px;
  width: 100%;
  background-color: ${COLOR.White};
  padding-bottom: 25px;
  height: 100%;
  .title {
    color: ${COLOR.Black};
    font-size: 16px;
    font-style: normal;
    font-weight: 600;
    line-height: normal;
    padding: 15px;
    padding-top: 30px;
    padding-bottom: 30px;
    width: 100%;
  }
`;

type DashboardStatisticProps = {
  params: any;
  getMemberStatistic: any;
  getRequestStatistic: any;
  getHelpStatistic: any;
};

const DashboardStatistic: React.FC<DashboardStatisticProps> = (props) => {
  const { t }: any = useTranslation();

  const [loading, setLoading] = useState(false);
  const [memberStatistic, setMemberStatistic] = useState<any>([]);
  const [requestStatistic, setRequestStatistic] = useState<any>([]);
  const [helpStatistic, setHelpStatistic] = useState<any>([]);

  const fetchData = (action, params, setData) => {
    setLoading(true);
    action({ fromDate: params.fromDate, toDate: params.toDate })
      .then((res) => {
        setData(res?.content);
        setLoading(false);
      })
      .catch((err) => {
        console.error('trandev ~ file: index.js ~ line 17 ~ fetchData ~ err', err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData(props.getMemberStatistic, props.params, setMemberStatistic);
    fetchData(props.getRequestStatistic, props.params, setRequestStatistic);
    fetchData(props.getHelpStatistic, props.params, setHelpStatistic);
  }, [props.params]);

  const calculateGrowthPercent = (oldValue, newValue) => {
    const result = oldValue === 0 ? ((newValue - oldValue) / 1) * 100 : ((newValue - oldValue) / oldValue) * 100;
    return Number.parseFloat(Number.parseFloat(result.toString()).toFixed(2));
  };

  const statisticList = [
    {
      subTitle: t('members'),
      numbers: memberStatistic?.current?.totalMember || 0,
      percent: calculateGrowthPercent(memberStatistic?.previous?.totalMember || 0, memberStatistic?.current?.totalMember || 0),
      hasPrevious: true,
      currentStatistic: [
        {
          label: t('active'),
          value: memberStatistic?.current?.totalActive || 0,
          color: 'text-primary'
        },
        {
          label: t('totalPendingMember'),
          value: memberStatistic?.current?.totalWaiting || 0,
          color: 'text-warning'
        },
        {
          label: t('blocked'),
          value: memberStatistic?.current?.totalBlocked || 0,
          color: 'text-danger'
        }
      ],
      prevStatistic: [
        {
          label: t('prev_period'),
          value: memberStatistic?.previous?.totalMember || 0,
          color: 'color-grey'
        }
      ],
      prevStatisticFooter: [
        {
          label: t('active'),
          value: memberStatistic?.previous?.totalActive || 0
        },
        {
          label: t('totalPendingMember'),
          value: memberStatistic?.previous?.totalWaiting || 0
        },
        {
          label: t('blocked'),
          value: memberStatistic?.previous?.totalBlocked || 0
        }
      ]
    },
    {
      subTitle: t('requests_of_members'),
      numbers: requestStatistic?.current?.totalRequest || 0,
      percent: calculateGrowthPercent(requestStatistic?.previous?.totalRequest || 0, requestStatistic?.current?.totalRequest || 0),
      hasPrevious: true,
      currentStatistic: [
        {
          label: t('new'),
          value: requestStatistic?.current?.totalNewRequest || 0,
          color: 'text-primary'
        },
        {
          label: t('fixed'),
          value: requestStatistic?.current?.totalFixed || 0,
          color: 'text-success'
        },
        {
          label: t('Cancelled'),
          value: requestStatistic?.current?.totalCanceled || 0,
          color: 'text-danger'
        }
      ],
      prevStatistic: [
        {
          label: t('prev_period'),
          value: requestStatistic?.previous?.totalRequest || 0,
          color: 'color-grey'
        }
      ],
      prevStatisticFooter: [
        {
          label: t('new'),
          value: requestStatistic?.previous?.totalNewRequest || 0
        },
        {
          label: t('fixed'),
          value: requestStatistic?.previous?.totalFixed || 0
        },
        {
          label: t('Cancelled'),
          value: requestStatistic?.previous?.totalCanceled || 0
        }
      ]
    },
    {
      subTitle: t('helps_of_members'),
      numbers: helpStatistic?.current?.totalRepair || 0,
      percent: calculateGrowthPercent(helpStatistic?.previous?.totalRepair || 0, helpStatistic?.current?.totalRepair || 0),
      hasPrevious: true,
      currentStatistic: [
        {
          label: t('done'),
          value: helpStatistic?.current?.totalDone || 0,
          color: 'text-primary'
        },
        {
          label: t('not_done'),
          value: helpStatistic?.current?.totalNotDone || 0,
          color: 'text-warning'
        },
        {
          label: t('Cancelled'),
          value: helpStatistic?.current?.totalCanceled || 0,
          color: 'text-danger'
        }
      ],
      prevStatistic: [
        {
          label: t('prev_period'),
          value: helpStatistic?.previous?.totalRepair || 0,
          color: 'color-grey'
        }
      ],
      prevStatisticFooter: [
        {
          label: t('done'),
          value: helpStatistic?.previous?.totalDone || 0
        },
        {
          label: t('not_done'),
          value: helpStatistic?.previous?.totalNotDone || 0
        },
        {
          label: t('Cancelled'),
          value: helpStatistic?.previous?.totalCanceled || 0
        }
      ]
    }
  ];

  return (
    <RightContent>
      <div className="title">
        <span>{t('statistics').toUpperCase()}</span>
      </div>
      {statisticList.map((item, index) => (
        <div className="w-100">
          <ASpinner spinning={loading}>
            <UIStatisticVer2 data={item} hasBorderBottom={index !== statisticList.length - 1} />
          </ASpinner>
        </div>
      ))}
    </RightContent>
  );
};

export default connect(null, {
  getMemberStatistic: dashboardActions.getMemberStatistic,
  getRequestStatistic: dashboardActions.getRequestStatistic,
  getHelpStatistic: dashboardActions.getHelpStatistic
})(DashboardStatistic);
