import React, { useEffect, useState } from 'react';
import { useSubheader } from '~/views/presentation/core/Subheader';

import DashboardChart from './charts';
import DashboardStatistic from './dashboard-statistic';

type MechanicDashboardProps = {};

const MechanicDashboard: React.FC<MechanicDashboardProps> = (props) => {
  const { dashboardDate } = useSubheader();

  return (
    <div className="mt-10 row">
      <div className="col-lg-8 col-md-8 col-12 pl-lg-0">
        <DashboardChart params={dashboardDate} />
      </div>
      <div className="col-lg-4 col-md-4 col-12 mt-10 mt-lg-0 mt-md-0">
        <DashboardStatistic params={dashboardDate} />
      </div>
    </div>
  );
};

export default MechanicDashboard;
