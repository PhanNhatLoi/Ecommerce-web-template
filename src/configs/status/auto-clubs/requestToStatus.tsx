import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const HELP_STATUS = {
  ALL: 'ALL',
  CONSUMER: 'CONSUMER',
  TECHNICIAN: 'TECHNICIAN'
};

export const renderRequestToStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case HELP_STATUS.ALL:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.CONSUMER:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case HELP_STATUS.TECHNICIAN:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
