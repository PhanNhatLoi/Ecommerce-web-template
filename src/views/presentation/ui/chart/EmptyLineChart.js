import { Empty } from 'antd/es';
import Axis from 'bizcharts/es/components/Axis';
import Chart from 'bizcharts/es/components/Chart';
import Legend from 'bizcharts/es/components/Legend';
import Tooltip from 'bizcharts/es/components/Tooltip';
import LineAdvance from 'bizcharts/es/geometry/Point';
import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

function VisualChart(props) {
  const { t } = useTranslation();
  const monthLocalize = (value) => {
    const monthValue = value.substring(0, 3);
    return t(monthValue) + value.substring(4, value?.length);
  };
  return (
    <Chart padding="auto" autoFit height={300} data={props.data}>
      <Axis
        name="count"
        label={{
          formatter: (text, item, index) => {
            return numberFormatDecimal(+text);
          }
        }}
      />
      <Axis
        name={props.yAxis || 'month'}
        label={{
          formatter: (text, item, index) => {
            return monthLocalize(text);
          }
        }}
      />
      <Legend visible={false} />
      <Tooltip visible={false} />
      <LineAdvance //
        style={{
          lineWidth: 0,
          fill: 'transparent',
          shadowColor: 'transparent',
          opacity: 0,
          fillOpacity: 0
        }}
        shape="smooth"
        point
        area
        position={props.position} // point position
        color={props.color} // color of the line
      />
    </Chart>
  );
}

function EmptyLineChart(props) {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <VisualChart //
        data={props.data}
        position={props.position}
        color={props.color}
        style={{ opacity: '0.5' }}
      />
      <Empty //
        image={Empty.PRESENTED_IMAGE_SIMPLE}
        style={{ position: 'absolute', top: '22%', left: '47%' }}
      />
    </div>
  );
}

export default EmptyLineChart;
