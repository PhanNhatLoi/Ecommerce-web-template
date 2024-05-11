import { Empty } from 'antd/es';
import { Axis, Chart, Coordinate, getTheme, Interval, Tooltip } from 'bizcharts/es';
import React from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';

const ChartStyled = styled(Chart)`
  .g2-tooltip .g2-tooltip-list .g2-tooltip-list-item {
    width: max-content;
  }
`;

function PieChart(props) {
  const { t } = useTranslation();
  const colors = props.data.reduce((pre, cur, idx) => {
    pre[cur.item] = getTheme().colors10[idx];
    return pre;
  }, {});

  const cols = {
    percent: {
      formatter: (val) => {
        val = val + '%';
        return val;
      }
    }
  };
  const localizeData = (data) => {
    const result = data.map((obj, index) => ({ ...obj, item: t(obj.item) }));
    return result;
  };
  return (
    <>
      {props.data.some((item) => item?.percent !== 0) ? (
        <ChartStyled //
          height={props.height || 300}
          data={localizeData(props.data)}
          scale={cols}
          interactions={['element-active']}
          autoFit
          padding="auto">
          <Coordinate type="theta" radius={props.radius || 0.75} />
          <Tooltip showTitle={false} />
          <Axis visible={false} />
          <Interval
            position="percent"
            adjust="stack"
            color="item"
            style={{
              lineWidth: 1,
              stroke: '#fff'
            }}
            label={[
              'item',
              (item) => {
                return {
                  offset: props.offset || 30,
                  content: (data) => {
                    if (data.percent > 0) return `${data.percent}%`;
                  },
                  style: {
                    fill: colors[item]
                  }
                };
              }
            ]}
          />
        </ChartStyled>
      ) : (
        <Empty style={{ marginTop: '40px' }} image={Empty.PRESENTED_IMAGE_SIMPLE} />
      )}
    </>
  );
}

export default React.memo(PieChart);
