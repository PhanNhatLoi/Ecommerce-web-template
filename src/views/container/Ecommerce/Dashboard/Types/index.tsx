import { ChartDataResponse } from '~/state/ducks/carAccessories/dashboard/actions';

export interface ChartItemProps {
  label: string;
  data: ChartDataResponse[];
  dateKey?: string;
  countKey?: string;
  position: string;
  color: string;
  isPrice?: boolean;
  params?: any;
  tooltipLabel?: string;
}

export interface StatisticDataType {
  month: string;
  count?: number;
}
