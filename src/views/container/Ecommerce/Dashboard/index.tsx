import React from 'react';
import { useSubheader } from '~/views/presentation/core/Subheader';
import DashboardStatistic from './statistic';
import LeftContent from './LeftContent';

type EcommerceDashboardProps = {};

const EcommerceDashboard: React.FC<EcommerceDashboardProps> = (props) => {
  const { dashboardDate } = useSubheader();

  return (
    <div className="mt-10">
      <div className="row">
        <div className="col-lg-8 col-md-8 col-12 pl-lg-0">
          <LeftContent params={dashboardDate} />
        </div>
        <div className="col-lg-4 col-md-4 col-12 mt-10 mt-lg-0 mt-md-0">
          <DashboardStatistic params={dashboardDate} />
        </div>
      </div>
    </div>
  );
};

export default EcommerceDashboard;
