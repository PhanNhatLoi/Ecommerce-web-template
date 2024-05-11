import React from 'react';

export type Media = {
  url: String | string | undefined;
  type: String | string;
};
export type Product = {
  id: String;
  code: String;
  oldCode: String;
  upcCode: Number;
  name: String;
  shortName: String;
  inStockPrice: Number;
  keywords: String;
  note: String;
  tags: String;
  description: String;
  details: String;
  specifications: String;
  origin: String;
  stockQuantity: number;
  guaranteeTime: number;
  conversionSku?: Number;
  price: Number;
  approveStatus: String;
  productStatus: String;
  supplierId: Number;
  minPrice: Number;
  unit: {
    id: String;
    name: String;
    shortName: String;
  };
  media: Array<Media>;
  isManageStock: Boolean;
  prices: Array<any>;
  mainMedia: Array<Media>;
  subMedia: Array<Media>;
  categories: Array<Category>;
  status?: String;
  shipping?: any;
};

export type Category = {
  id: String;
  name: String;
  icon?: String;
  index?: Number;
  default?: Boolean;
  isDefault?: Boolean;
  subCatalogs?: Array<Category>;
};
export type Units = {
  description: String;
  id: String;
  name: String;
  shortName: String;
};

export type Column = {
  dataField: String;
  text: String;
  style?: React.CSSProperties;
  headerStyle?: React.CSSProperties;
  formatter?: any;
  sort?: Boolean;
  onSort?: any;
  filterRenderer?: ((onFilter, column) => React.ReactElement) | '';
  csvText?: String;
  csvFormatter?: any;
  editable?: Boolean;
  sortCaret?: any;
  headerClasses?: String;
  headerFormatter?: any;
  filter?: any;
  align?: String;
  classes?: String;
  headerAlign?: String;
  footerAlign?: String;
};
export type ActionType = {
  icon: any;
  text: String;
  onClick: (row: any) => void;
  alterIcon?: String;
  alterText?: String;
  stt?: String;
  key?: string;
};
export type ActionListType = {
  viewAction: ActionType;
  deleteAction: ActionType;
  editAction: ActionType;
  stopAction: ActionType;
  sendAction: ActionType;
};
