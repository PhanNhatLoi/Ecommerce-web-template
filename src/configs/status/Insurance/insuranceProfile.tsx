import { StatusCssClasses } from '~/views/presentation/table-bootstrap-hook/Status/StatusCssClasses';

export const INSURANCE_PROFILE_STATUS = {
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL',
  ACTIVATED: 'ACTIVATED'
};

export const renderInsuranceProfileStatus = (status, localize, type = 'string') => {
  if (type === 'string') {
    return localize;
  } else if (type === 'tag') {
    switch (status) {
      case INSURANCE_PROFILE_STATUS.WAITING_FOR_APPROVAL:
        return <span className={`label label-lg label-light-${StatusCssClasses.warning} label-inline text-nowrap`}>{localize}</span>;
      case INSURANCE_PROFILE_STATUS.ACTIVATED:
        return <span className={`label label-lg label-light-${StatusCssClasses.success} label-inline text-nowrap`}>{localize}</span>;
      default:
        return '';
    }
  }
};
