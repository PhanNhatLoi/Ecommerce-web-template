import { ReactNode } from 'react';
export type subMenuType = {
  path: string;
  action?: string[];
  subMenus?: subMenuType[];
  title: {
    props: {
      i18nKey: string;
    };
  };
};

export type subMenuListType = {
  key: React.ReactNode;
  title: string;
  path: string;
  action: string[];
  children?: subMenuListType[];
};

export type subMenuListTable = {
  path: string;
  title: string;
};

export type CheckboxType = {
  view: boolean;
  edit: boolean;
  delete: boolean;
  actionOther: boolean;
};

export type CountType = {
  view: number;
  edit: number;
  delete: number;
  actionOther: number;
};

export type CheckedChildren = {
  key: ReactNode;
  action?: CheckboxType;
  indeterminate?: CheckboxType;
};

export const ActionBtn = {
  VIEW: 'view',
  EDIT: 'edit',
  DELETE: 'delete',
  ACTIONOTHER: 'actionOther'
};

export interface InfoMenu {
  path: string;
  title: {
    props: {
      i18nKey: any;
    };
  };
  parent?: any;
  permission?: any;
  showOnlyVendor?: boolean;
  disabledAction?: string[];
}
export interface Menu extends InfoMenu {
  subMenus?: Array<Menu>;
}
export interface DataSource extends InfoMenu {
  key: any;
  access: any;
  children: Array<DataSource> | undefined;
  status?: string;
}

export const defaultValueAccess = {
  access: true,
  nonAccess: false,
  viewOnly: false
};

export const statusRole = {
  ACTIVATED: 'ACTIVATED'
};
