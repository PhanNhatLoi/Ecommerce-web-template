import { Moment } from 'moment';

export interface ColumnType {
  dataField: string;
  text: string;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  formatter?: any;
  sort?: boolean;
  onSort?: any;
  filterRenderer?: ((onFilter: any, column: any) => React.ReactElement) | '';
  csvText?: string;
  csvFormatter?: any;
  editable?: boolean;
  sortCaret?: any;
  headerClasses?: string;
  headerFormatter?: any;
  filter?: any;
  align?: string;
  classes?: string;
  hidden?: boolean;
}
