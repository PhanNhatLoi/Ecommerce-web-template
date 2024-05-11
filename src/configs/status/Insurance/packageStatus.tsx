import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const PACKAGE_STATUS = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  ACTIVATED: 'ACTIVATED',
  DEACTIVATED: 'DEACTIVATED',
  REJECTED: 'REJECTED'
};

export const INSURANCE_PACKAGE_TYPE = {
  PERSONAL_ACCIDENT: 'PERSONAL_ACCIDENT',
  AUTO_PHYSICAL_DAMAGE: 'AUTO_PHYSICAL_DAMAGE'
};

export const renderPackageStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case PACKAGE_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case PACKAGE_STATUS.ACTIVATED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      case PACKAGE_STATUS.DEACTIVATED:
        return <span className={`label label-lg label-light-${StatusCssClasses.link} label-inline text-nowrap`}>{localize}</span>;
      case PACKAGE_STATUS.REJECTED:
        return <span className={`label label-lg label-light-${StatusCssClasses.danger} label-inline text-nowrap`}>{localize}</span>;
      case INSURANCE_PACKAGE_TYPE.PERSONAL_ACCIDENT:
        return <span className={`label label-lg label-light-${StatusCssClasses.primary} label-inline text-nowrap`}>{localize}</span>;
      case INSURANCE_PACKAGE_TYPE.AUTO_PHYSICAL_DAMAGE:
        return <span className={`label label-lg label-light-${StatusCssClasses.info} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
