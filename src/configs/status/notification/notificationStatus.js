import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const NOTIFICATION_STATUS = {
  SUCCESSFULLY: 'SUCCESSFULLY',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  FAILURE: 'FAILURE',
  REJECTED: 'REJECTED'
};

export const renderNotificationStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case NOTIFICATION_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case NOTIFICATION_STATUS.SUCCESSFULLY:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case NOTIFICATION_STATUS.FAILURE:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case NOTIFICATION_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
