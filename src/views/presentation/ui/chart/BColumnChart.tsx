import ColumnChart from 'bizcharts/es/plots/ColumnChart';
import moment, { Moment } from 'moment';
import React, { useEffect, useState } from 'react';
import { useWindowSize } from 'react-use';
import styled from 'styled-components';
import { DEFAULT_AXIS_100000, TIME_UNITS } from '~/configs';
import ASpinner from '~/views/presentation/ui/loading/ASpinner';
import { numberFormatDecimal } from '~/views/utilities/helpers/currency';

export const VerticalChartStyled = styled.div`
  overflow-x: scroll;
`;

type BColumnChartProps = {
  data: any;
  alias?: string;
  dateType?: string;
  params?: any;
  loading?: boolean;
  isPrice?: boolean;
};

const BColumnChart: React.FC<BColumnChartProps> = (props) => {
  const { width } = useWindowSize();
  const [columnNumber, setColumnNumber] = useState(0);
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    setChartData(getDataChartByTime(props.data, props.params, props.dateType || TIME_UNITS.DATE.toLowerCase()));
  }, [props.data]);

  const getDiff = (fromDate: Moment, toDate: Moment, timeType: string) => {
    if (timeType === TIME_UNITS.DATE.toLowerCase()) return toDate.diff(fromDate, 'days');
    else {
      const newTimeType: any = `${timeType}s`;
      return toDate.diff(fromDate, newTimeType);
    }
  };

  const getTimeSubtract = (toDate: Moment, i: number, timeType: any) => {
    const newTimeType: any = timeType === TIME_UNITS.DATE.toLowerCase() ? 'days' : `${timeType}s`;
    return toDate.subtract(i, newTimeType).startOf(timeType.toLowerCase());
  };

  const formatDate = (obj: any, timeType: string) => {
    switch (timeType) {
      case TIME_UNITS.DATE.toLowerCase():
        return obj.time.format('DD/MM/YYYY');
      case TIME_UNITS.MONTH.toLowerCase():
        return obj.time.format('M/YYYY');
      case TIME_UNITS.QUARTER.toLowerCase():
        return `Q${obj.time.format('Q/YYYY')}`;
      case TIME_UNITS.YEAR.toLowerCase():
        return obj.time.format('YYYY');
      default:
        return;
    }
  };

  const getDataChartByTime = (chartData: any[], params: any, timeType: any) => {
    let dateList: any[] = [];

    // khoảng thời gian từ fromDate đến toDate
    const diff: any = getDiff(moment(params?.fromDate), moment(params?.toDate), timeType);

    // lấy danh sách thời gian theo ngày/tháng/quý/năm từ fromDate đến toDate
    for (let i = diff; i >= 0; i--) {
      dateList.push({ time: getTimeSubtract(moment(params?.toDate), i, timeType) });
    }

    setColumnNumber(dateList.length);

    dateList.forEach((obj, index) => {
      const date = obj.time;
      const endOfTime = moment(date).endOf(timeType.toLowerCase()); // ngày cuối cùng của date

      let sum = 0;

      // lấy các giá trị từ ngày đầu tiên đến ngày cuối cùng trong danh sách thời gian rồi tính tổng
      chartData?.forEach((data: any) => {
        if (moment(data.date).isBetween(moment(date), moment(endOfTime), undefined, '[]')) {
          sum += data.statisticValue;
        }
      });

      dateList[index].sumValue = sum;
    });

    const result = dateList.map((obj: any) => ({
      date: formatDate(obj, timeType),
      statisticValue: obj.sumValue
    }));

    return result?.every((item) => !item.statisticValue)
      ? [
          ...result,
          {
            statisticValue: DEFAULT_AXIS_100000
          }
        ]
      : result;
  };

  return (
    <ASpinner spinning={props.loading}>
      <VerticalChartStyled>
        <ColumnChart
          data={chartData}
          autoFit
          xField="date"
          yField="statisticValue"
          width={columnNumber > 12 || width < 1250 ? 1000 + columnNumber * 50 : undefined}
          label={{ visible: true, position: 'top', offsetY: 10, layout: { type: 'limit-in-shape' } }}
          meta={{
            statisticValue: {
              alias: props.alias,
              formatter: (value) => numberFormatDecimal(value, props.isPrice ? ' đ' : '', '')
            }
          }}
        />
      </VerticalChartStyled>
    </ASpinner>
  );
};

export default React.memo(BColumnChart);
