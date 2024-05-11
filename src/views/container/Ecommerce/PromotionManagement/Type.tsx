export type columnType = {
  dataField: string;
  text: string;
  style?: {
    minWidth: number;
    textAlign: string;
  };
  filter?: any;
  filterRenderer?: any;
  sort?: any;
  csvText?: any;
  csvFormatter?: any;
};

export type paramType = {
  page?: number;
  size?: number;
  sort?: string;
  promotionType?: String;
};

export type confirmType = {
  type: string;
  id: number;
};

export type unlimitType = {
  time: boolean;
  maxDiscount: boolean;
  quantity: boolean;
  quantityForUser: boolean;
};
