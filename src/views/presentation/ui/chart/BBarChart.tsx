import BarChart from 'bizcharts/es/plots/BarChart';
import React, { useEffect, useState } from 'react';
import { RequireParams } from '~/state/ducks/carServices/report/actions';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

import ASpinner from '../loading/ASpinner';

type BBarChartProps = {
  data: any;
  params?: RequireParams;
  yField?: string;
  alias?: string;
  loading?: boolean;
  isPrice?: boolean;
};

const BBarChart: React.FC<BBarChartProps> = (props) => {
  return (
    <ASpinner spinning={props.loading}>
      <BarChart
        data={props.data}
        autoFit
        xField="statisticValue"
        yField={props.yField ? props.yField : 'name'}
        height={props.data?.length > 10 ? 400 + props.data?.length * 50 : undefined}
        label={{ visible: true, position: 'right' }}
        meta={{
          statisticValue: {
            alias: props.alias,
            formatter: (value) => numberFormatDecimal(value, props.isPrice ? ' đ' : '', '')
          }
        }}
        yAxis={{
          label: {
            autoHide: props.data?.length > 0 ? false : true,
            autoEllipsis: true
          },
          verticalLimitLength: 93
        }}
      />
    </ASpinner>
  );
};

export default React.memo(BBarChart);
