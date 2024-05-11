import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { organizationSummaryActions } from '~/state/ducks/organizationSummary';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import NewVerUIStatistic from '~/views/presentation/ui/statistic/NewVerUIStatistic';

import ChartItem from './ChartItem';

type DashboardItemProps = {
  statisticTitle?: string;
  statisticData: any;
  chartData: any;
  params: any;
  loading: boolean;
  isHorizontal?: boolean;
  handleViewAll: () => void;
};

const DashboardItem: React.FC<DashboardItemProps> = (props) => {
  const { t }: any = useTranslation();

  return (
    <div className="row">
      <div className="col-12">
        <ASpinner spinning={props.loading}>
          <NewVerUIStatistic data={props.statisticData} />
        </ASpinner>
      </div>

      <div className="col-12">
        <ChartItem
          label={props.chartData.label}
          tooltipLabel={props.chartData.tooltipLabel}
          data={props.chartData.data}
          isPrice={props.chartData.isPrice}
          position="date*count"
          color="type"
          params={props.params}
          loading={props.loading}
        />
      </div>
    </div>
  );
};

export default connect(null, {
  getSummaryStatistic: organizationSummaryActions.getSummaryStatistic
})(DashboardItem);
