import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const ITEMS_LIST_FIND = {
  UNIT: 'Unit',
  BIN: 'Bin',
  BOX: 'Box',
  BAG : "Bag"
};

export const ITEMS_LIST_UNIT_ID = {
  UNIT: 1,
  BIN: 2,
  BOX: 3,
  BAG : 4
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderItemsFind = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    let nameStatusCSS;
    switch (status) {
      case ITEMS_LIST_FIND.BAG:
        nameStatusCSS = StatusCssClasses.primary;
        break;
      case ITEMS_LIST_FIND.BOX:
        nameStatusCSS = StatusCssClasses.info;
        break;
      case ITEMS_LIST_FIND.UNIT:
        nameStatusCSS = StatusCssClasses.success;
        break;
      case ITEMS_LIST_FIND.BIN:
        nameStatusCSS = StatusCssClasses.danger;
        break;
      default:
        nameStatusCSS = StatusCssClasses.primary;
        break;
    }
    return <span className={`label label-lg label-light-${nameStatusCSS} label-inline text-nowrap`}>{localize}</span>;

  }
};
