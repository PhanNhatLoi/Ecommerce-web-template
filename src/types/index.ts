export type ColumnType = {
  dataField: string;
  text: string;
  style: {
    minWidth: number;
    textAlign: string;
  };

  filter?: any;
  filterRenderer?: any;
  sort?: any;
  csvText?: any;
  csvFormatter?: any;
};

export type ActionType = {
  key: string;
  icon: React.ReactNode;
  alterIcon?: React.ReactNode;
  text: string;
  alterText?: string;
  onClick: () => void;
};
