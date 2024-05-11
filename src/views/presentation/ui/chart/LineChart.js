import Axis from 'bizcharts/es/components/Axis';
import Chart from 'bizcharts/es/components/Chart';
import Legend from 'bizcharts/es/components/Legend';
import Tooltip from 'bizcharts/es/components/Tooltip';
import LineAdvance from 'bizcharts/es/geometry/Point';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

function LineChart(props) {
  const { t } = useTranslation();
  const monthLocalize = (value) => {
    const monthValue = value.substring(0, 3);
    return t(monthValue) + value.substring(4, value?.length);
  };
  return (
    <Chart scale={props.scale} padding="auto" autoFit height={300} data={props.data}>
      <Axis
        name="count"
        label={{
          formatter: (text, item, index) => {
            return numberFormatDecimal(+text);
          }
        }}
      />
      <Axis
        name="month"
        label={{
          formatter: (text, item, index) => {
            return monthLocalize(text);
          }
        }}
      />
      <Legend visible={false} />
      <Tooltip
        title={(e) => monthLocalize(e)}
        customItems={(e) => {
          return [
            {
              ...e[0],
              value: numberFormatDecimal(+e[0].value),
              name: t(e[0].name)
            }
          ];
        }}
      />
      <LineAdvance //
        shape="smooth"
        point
        area
        position={props.position} // point position
        color={props.color} // color of the line
      />
    </Chart>
  );
}

export default LineChart;
