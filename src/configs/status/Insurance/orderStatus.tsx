import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const ORDER_STATUS = {
  WAITING: 'WAITING',
  WAITING_BANK_TRANSFER: 'WAITING_BANK_TRANSFER',
  WAITING_CASH_PAYMENT_CONFIRM: 'WAITING_CASH_PAYMENT_CONFIRM',
  WAITING_BANK_TRANSFERRED_CONFIRM: 'WAITING_BANK_TRANSFERRED_CONFIRM',
  DONE: 'DONE',
  CANCELED: 'CANCELED'
};

export const renderOrderStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case ORDER_STATUS.WAITING:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case ORDER_STATUS.WAITING_BANK_TRANSFER:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      case ORDER_STATUS.WAITING_CASH_PAYMENT_CONFIRM:
      case ORDER_STATUS.WAITING_BANK_TRANSFERRED_CONFIRM:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case ORDER_STATUS.DONE:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case ORDER_STATUS.CANCELED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
