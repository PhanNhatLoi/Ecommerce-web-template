import React from 'react';
import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const MESSAGE_TYPE = {
  // TODO: Change to API value
  MESSAGE_TYPE_PRIMARY: 'GENERAL',
  MESSAGE_TYPE_INFO: 'EVENT',
  MESSAGE_TYPE_WARNING: 'ANNOUNCEMENT',
  MESSAGE_TYPE_DANGER: 'POLICY'
};

/**
 * THIS IS  FUNCTION
 * @Input:
 * @Output:
 * @Description:
 * @Author: ithoangtan@gmail.com
 * @Date: 2021-06-05 16:04:14
 */
export const renderMessageType = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case MESSAGE_TYPE.MESSAGE_TYPE_PRIMARY:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case MESSAGE_TYPE.MESSAGE_TYPE_INFO:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case MESSAGE_TYPE.MESSAGE_TYPE_WARNING:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case MESSAGE_TYPE.MESSAGE_TYPE_SUCCESS:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case MESSAGE_TYPE.MESSAGE_TYPE_DANGER:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
