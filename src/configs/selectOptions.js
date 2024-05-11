import { requestDistributionTabs, topMemberTabs, topTechnicianTabs, userDistributionTabs } from './const';

//dashboard
export const requestDistributionOptions = (t) => [
  {
    value: requestDistributionTabs.CATEGORY,
    label: t('byCategory')
  },
  {
    value: requestDistributionTabs.CITY,
    label: t('byCity')
  }
];

export const userDistributionOptions = (t) => [
  {
    value: userDistributionTabs.CITY,
    label: t('byCity')
  },
  {
    value: userDistributionTabs.GROUP,
    label: t('byGroup')
  }
];

export const topMemberOptions = (t) => [
  {
    value: topMemberTabs.REQUEST,
    label: t('byRequest')
  },
  {
    value: topMemberTabs.HELPS,
    label: t('byHelps')
  }
];

export const topTechnicianOptions = (t) => [
  {
    value: topTechnicianTabs.FIXES,
    label: t('byFixes')
  },
  {
    value: topTechnicianTabs.REVENUE,
    label: t('byRevenue')
  }
];

export const IncidentStatusOptions = (t) => [
  {
    value: 'DONE',
    label: t('DONE')
  },
  {
    value: 'CANCELED_BY_REQUESTER',
    label: t('CANCELED_BY_REQUESTER')
  },
  {
    value: 'WAITING_APPROVE_FROM_REQUESTER',
    label: t('WAITING_APPROVE_FROM_REQUESTER')
  },
  {
    value: 'FIXING',
    label: t('FIXING')
  }
];

export const technicianStatusOptions = (t) => [
  {
    value: 'APPROVED',
    label: t('APPROVED')
  },
  {
    value: 'WAITING_FOR_APPROVAL',
    label: t('WAITING_FOR_APPROVAL')
  }
];

export const scheduleOptions = (t) => [
  { value: 'daily', label: t('daily') },
  {
    value: 2,
    label: t('monday')
  },
  {
    value: 3,
    label: t('tuesday')
  },
  {
    value: 4,
    label: t('wednesday')
  },
  {
    value: 5,
    label: t('thursday')
  },
  {
    value: 6,
    label: t('friday')
  },
  {
    value: 7,
    label: t('saturday')
  },
  {
    value: 8,
    label: t('sunday')
  }
];

export const sendDateOptions = (t) => [
  {
    value: 'now',
    label: t('send_now')
  },
  {
    value: 'schedule',
    label: t('schedule')
  }
];

export const typeNoticeOptions = (t) => [
  {
    value: 1,
    label: t('from_community')
  },
  {
    value: 2,
    label: t('event')
  },
  {
    value: 3,
    label: t('regulations')
  },
  {
    value: 4,
    label: t('share')
  }
];

export const receiverOptions = (t) => [
  {
    value: 'members',
    label: t('all_members')
  },
  {
    value: 'manual',
    label: t('add_each_person')
  },
  {
    value: 'technicians',
    label: t('all_technicians')
  }
];

export const distanceOptions = (t) => [
  {
    value: 'all',
    label: t('country')
  },
  {
    value: 'settting',
    label: t('setting_km')
  }
];

export const acceptProblemsOptions = (t) => [
  {
    value: 'all',
    label: t('receive_all')
  },
  {
    value: 'members',
    label: t('receive_members')
  }
];

// registration form
export const businessTypeOptions = (t) => [
  {
    value: '',
    label: t('type')
  },
  {
    value: 'ORGANIZATION',
    label: t('ORGANIZATION')
  },
  {
    value: 'COMMUNITY',
    label: t('COMMUNITY')
  },
  {
    value: 'CLUB',
    label: t('CLUB')
  },
  {
    value: 'GROUP',
    label: t('GROUP')
  },
  {
    value: 'GARAGE',
    label: t('GARAGE')
  },
  {
    value: 'OTHER',
    label: t('OTHER')
  }
];

export const numberMembersOptions = (t) => [
  {
    value: '',
    label: t('members')
  },
  {
    value: 'SMALLER100',
    label: t('SMALLER100')
  },
  {
    value: '100TO500',
    label: t('100TO500')
  },
  {
    value: 'GREATER500',
    label: t('GREATER500')
  }
];

export const numberTechniciansOptions = (t) => [
  {
    value: '',
    label: t('numbersOfTechnicians')
  },
  {
    value: 'SMALLER100',
    label: t('SMALLER100')
  },
  {
    value: '100TO500',
    label: t('100TO500')
  },
  {
    value: 'GREATER500',
    label: t('GREATER500')
  }
];

export const hostTypeOptions = (t) => [
  {
    value: 'TECHNICIAN',
    label: t('HOST_TECHNICIAN')
  },
  {
    value: 'MEMBER',
    label: t('HOST_MEMBER')
  },
  {
    value: 'SELLER',
    label: t('HOST_SELLER')
  }
];

export const tabsReportOptions = (t) => [
  {
    value: 'incident',
    label: t('incident')
  },
  {
    value: 'member',
    label: t('member')
  },
  {
    value: 'technician',
    label: t('technician')
  },
  {
    value: 'repairIncident',
    label: t('incident_fixed_by_tech')
  },
  {
    value: 'sales',
    label: t('sales')
  },
  {
    value: 'notification',
    label: t('notification')
  }
];

export const tabsTop10Member = (t) => [
  {
    value: 'helps',
    label: t('most_help')
  },
  {
    value: 'xim',
    label: t('most_xim')
  },
  {
    value: 'Incidents',
    label: t('most_incident')
  }
];

export const tabsTop10Technician = (t) => [
  {
    value: 'sales',
    label: t('most_sales')
  },
  {
    value: 'fixed',
    label: t('most_fixed')
  },
  {
    value: 'feedback',
    label: t('most_feedback')
  }
];
