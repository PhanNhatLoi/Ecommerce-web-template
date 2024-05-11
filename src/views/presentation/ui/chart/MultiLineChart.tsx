import Axis from 'bizcharts/es/components/Axis';
import Chart from 'bizcharts/es/components/Chart';
import Legend from 'bizcharts/es/components/Legend';
import Tooltip from 'bizcharts/es/components/Tooltip';
import Line from 'bizcharts/es/geometry/Line';
import Point from 'bizcharts/es/geometry/Point';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useWindowSize } from 'react-use';
import { TIME_UNITS } from '~/configs';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

type MultipleLineChartProps = {
  data: any;
  label: string;
  keys?: string[];
  params?: any;
  height?: number;
  scale?: any;
  showLegend?: boolean;
  xAxis?: string;
  position?: string;
  color?: string;
  isPrice?: boolean;
  className?: any;
  tooltipName?: any;
};

const MultipleLineChart: React.FC<MultipleLineChartProps> = (props) => {
  const { t }: any = useTranslation();
  const { width } = useWindowSize();
  const [columnNumber, setColumnNumber] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);
  const [isEmptyChart, setIsEmptyChart] = useState(false);

  useEffect(() => {
    let chartData = getChartData(getDataChartByTime(props.data, props.keys, props.params), props.label);

    setChartData(chartData);
    setIsEmptyChart(chartData?.every((data: any) => !data?.count));
  }, [props.data, props.keys, props.params]);

  const getDiff = (fromDate: Moment, toDate: Moment, timeBy: string) => {
    if (timeBy === TIME_UNITS.DATE.toLowerCase()) return toDate.diff(fromDate, 'days');
    else {
      const newTimeBy: any = `${timeBy}s`;
      return toDate.diff(fromDate, newTimeBy);
    }
  };

  const getTimeSubtract = (toDate: Moment, i: number, timeBy: any) => {
    const newTimeBy: any = timeBy === TIME_UNITS.DATE.toLowerCase() ? 'days' : `${timeBy}s`;
    return toDate.subtract(i, newTimeBy).startOf(timeBy.toLowerCase());
  };

  const formatDate = (time: Moment, timeBy: string) => {
    switch (timeBy) {
      case TIME_UNITS.DATE.toLowerCase():
        return time.format('DD/MM/YYYY');
      case TIME_UNITS.MONTH.toLowerCase():
        return time.format('M/YYYY');
      case TIME_UNITS.QUARTER.toLowerCase():
        return `Q${time.format('Q/YYYY')}`;
      case TIME_UNITS.YEAR.toLowerCase():
        return time.format('YYYY');
      default:
        return;
    }
  };

  //------------------------------------
  // GET STATISTIC FOR LINE CHART
  //------------------------------------
  const getDataChartByTime = (chartData: any[], keys: any, params: any) => {
    let dateList: any = [];

    // khoảng thời gian từ fromDate đến toDate
    const diff: any = getDiff(moment(params.fromDate), moment(params.toDate), params.timeBy);

    // lấy danh sách thời gian theo ngày/tháng/quý/năm từ fromDate đến toDate
    for (let i = diff; i >= 0; i--) {
      const newDate: any = {
        date: getTimeSubtract(moment(params.toDate), i, params.timeBy)
      };

      keys?.forEach((key: string) => {
        newDate[key] = 0;
      });

      dateList.push(newDate);
    }

    setColumnNumber(dateList.length);

    dateList.forEach((obj: any, index: number) => {
      const date = obj.date;
      const endOfDate = moment(date).endOf(params.timeBy.toLowerCase()); // ngày cuối cùng của date

      // lấy các giá trị từ ngày đầu tiên đến ngày cuối cùng trong danh sách thời gian rồi tính tổng
      chartData?.forEach((data: any) => {
        if (moment(data.date).isBetween(moment(date), moment(endOfDate), undefined, '[]')) {
          keys?.forEach((key: string) => {
            obj[key] += data[key];
          });
        }
      });
    });

    const formatData = dateList.map((obj: any) => ({
      ...obj,
      date: formatDate(obj.date, params.timeBy)
    }));

    return formatData;
  };

  const getChartData = (chartData: any[], label: string) => {
    const output: any = [];

    chartData.forEach((item) => {
      const { date, ...statisticsValue } = item;

      for (const key in statisticsValue) {
        output.push({
          date,
          type: t(key),
          count: statisticsValue[key]
        });
      }
    });

    return output;
  };
  //------------------------------------
  // GET STATISTIC FOR LINE CHART
  //------------------------------------

  return (
    <div className={props.className || 'mb-5'}>
      <Chart
        height={props.height || 300}
        width={columnNumber > 12 || width < 576 ? 300 + columnNumber * 50 : undefined}
        data={chartData}
        scale={props.scale || { count: Object.assign({}, { nice: true }, isEmptyChart && { min: 0, max: 10, tickCount: 5 }) }}
        autoFit>
        <Legend visible={props.showLegend || false} />
        <Axis name={props.xAxis || 'month'} />
        <Axis
          name="count"
          label={{
            formatter: (text, item, index) => {
              return numberFormatDecimal(+text);
            }
          }}
        />
        <Tooltip
          title={(e) => e}
          customItems={(e) => {
            return [
              {
                ...e[0],
                value: numberFormatDecimal(+e[0].value, props.isPrice ? ' đ' : '', ''),
                name: t(e[0].name)
              }
            ];
          }}
        />
        <Point
          position={props.position || 'date*count'}
          size={4}
          shape={'circle'}
          color={props.color}
          style={{
            stroke: '#fff',
            lineWidth: 1
          }}
        />
        <Line position={props.position || 'date*count'} size={2} color={props.color} shape={'line'} />
      </Chart>
    </div>
  );
};

export default React.memo(MultipleLineChart);
