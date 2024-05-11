import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const MEMBER_STATUS = {
  MEMBER_SUCCESS: 'APPROVED',
  MEMBER_WARNING: 'WAITING_FOR_APPROVAL',
  MEMBER_DANGER: 'DEACTIVATED',
  MEMBER_INFO: 'REJECTED'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderMemberStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case MEMBER_STATUS.MEMBER_PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case MEMBER_STATUS.MEMBER_INFO:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case MEMBER_STATUS.MEMBER_WARNING:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case MEMBER_STATUS.MEMBER_SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case MEMBER_STATUS.MEMBER_DANGER:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
