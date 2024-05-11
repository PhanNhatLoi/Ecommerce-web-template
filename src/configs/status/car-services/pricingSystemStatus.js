import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PRICING_SYSTEM_STATUS = {
  PRICING_SYSTEM_SUCCESS: 'ACTIVATED',
  PRICING_SYSTEM_DANGER: 'DEACTIVATED',
};

export const PRICING_UNIT = {
  DONG: 'DONG',
  DOLLARS: 'DOLLARS',
};

export const PRICING_STEP = {
  DONG: 1000,
  DOLLARS: 1,
};


/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderPricingSystemStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PRICING_SYSTEM_STATUS.PRICING_SYSTEM_PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case PRICING_SYSTEM_STATUS.PRICING_SYSTEM_INFO:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case PRICING_SYSTEM_STATUS.PRICING_SYSTEM_WARNING:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case PRICING_SYSTEM_STATUS.PRICING_SYSTEM_SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case PRICING_SYSTEM_STATUS.PRICING_SYSTEM_DANGER:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
