import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import styled from 'styled-components';
import { authSelectors } from '~/state/ducks/authUser';
import { useSubheader } from '~/views/presentation/core/Subheader';

import VendorInfo from './components/VendorInfo';
import NotificationInfo from './components/NotificationInfo';
import AutoClubStatistic from './Statistic/AutoClubStatistic';
import GarageStatistic from './Statistic/GarageStatistic';
import InsuranceStatistic from './Statistic/InsuranceStatistic';
import SupplierStatistic from './Statistic/SupplierStatistic';
import COLOR from '~/views/utilities/layout/color';

export const WrapperStyled = styled.div`
  border-radius: 8px;
  background: #fff;
`;

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
    display: flex;
    align-items: center;
    margin-bottom: 0;
    padding: 15px;
    background: #f8f8f8;
  }
`;

type DashboardProps = { getAuthUser: any };

const Dashboard: React.FC<DashboardProps> = (props) => {
  const { dashboardDate } = useSubheader();
  const [statisticByBusinessTypes, setStatisticByBusinessTypes] = useState<any>([]);

  useEffect(() => {
    const businessTypes = props.getAuthUser?.businessTypes;

    setStatisticByBusinessTypes(
      statisticList.filter((statistic) => {
        return businessTypes?.some((item) => item.id === statistic.id);
      })
    );
  }, [props.getAuthUser]);

  const statisticList = [
    {
      id: 3,
      component: AutoClubStatistic
    },
    {
      id: 9,
      component: GarageStatistic
    },
    {
      id: 24,
      component: SupplierStatistic
    },
    {
      id: 23,
      component: InsuranceStatistic
    }
  ];

  return (
    <div className="row mt-10">
      <div className="col-12 col-xl-8 mb-4 mb-xl-0">
        {statisticByBusinessTypes.map((c, index) => (
          <div key={c.id} className={`${index === statisticByBusinessTypes.length - 1 ? '' : 'mb-4'}`}>
            <c.component params={dashboardDate} />
          </div>
        ))}
      </div>
      <div className="col-12 col-xl-4" style={{ borderRadius: '8px' }}>
        <RightContent>
          <VendorInfo />
          <NotificationInfo />
        </RightContent>
      </div>
    </div>
  );
};

export default connect((state: any) => ({
  getAuthUser: authSelectors.getAuthUser(state)
}))(Dashboard);
