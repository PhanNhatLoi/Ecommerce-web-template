import React from 'react';

export const IncidentStatus = {
  DONE: 'DONE',
  CANCELED_BY_REQUESTER: 'CANCELED_BY_REQUESTER',
  WAITING_APPROVE_FROM_REQUESTER: 'WAITING_APPROVE_FROM_REQUESTER',
  FIXING: 'FIXING'
};

export const renderIncidentStatus = (status, t) => {
  switch (status) {
    case IncidentStatus.DONE:
      return <span className="label label-lg label-light-success label-inline text-nowrap">{t('DONE')}</span>;
    case IncidentStatus.CANCELED_BY_REQUESTER:
      return <span className="label label-lg label-light-danger label-inline text-nowrap">{t('CANCELED_BY_REQUESTER')}</span>;
    case IncidentStatus.WAITING_APPROVE_FROM_REQUESTER:
      return <span className="label label-lg label-light-primary label-inline text-nowrap">{t('WAITING_APPROVE_FROM_REQUESTER')}</span>;
    case IncidentStatus.FIXING:
      return <span className="label label-lg label-light-warning label-inline text-nowrap">{t('FIXING')}</span>;
    default:
      return;
  }
};

export const technicianStatus = {
  APPROVED: 'APPROVED',
  WAITING_FOR_APPROVAL: 'WAITING_FOR_APPROVAL'
};

export const renderTechnicianStatus = (status, t) => {
  switch (status) {
    case technicianStatus.APPROVED:
      return <span className="label label-lg label-light-success label-inline text-nowrap">{t('APPROVED')}</span>;
    case technicianStatus.WAITING_FOR_APPROVAL:
      return <span className="label label-lg label-light-google label-inline text-nowrap">{t('WAITING_FOR_APPROVAL')}</span>;
    default:
      return;
  }
};
