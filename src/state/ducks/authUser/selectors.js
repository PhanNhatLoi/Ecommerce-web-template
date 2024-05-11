import { createSelector } from 'reselect';
const path = 'authUser';

const userDataSelector = (state) => state[path].user;
export const getAuthUser = createSelector(userDataSelector, (user) => user);

const userDataRoleBase = (state) => state[path].roleBase;
export const getRoleBase = createSelector(userDataRoleBase, (roleBase) => roleBase);

export const getAuthentication = createSelector(
  (state) => state[path].isAuthenticated,
  (isAuthenticated) => isAuthenticated
);

const notificationUnreadQuantity = (state) => state[path].notificationUnreadQuantity;
export const getNotificationUnreadQuantity = createSelector(
  notificationUnreadQuantity,
  (notificationUnreadQuantity) => notificationUnreadQuantity
);

const accessNotification = (state) => state[path].accessNotification;
export const getAccessNotification = createSelector(accessNotification, (accessNotification) => accessNotification);

const newOrderQuantity = (state) => state[path].newOrderQuantity;
export const getNewOrderQuantity = createSelector(newOrderQuantity, (newOrderQuantity) => newOrderQuantity);

const newInsuranceOrderQuantity = (state) => state[path].newInsuranceOrderQuantity;
export const getNewInsuranceOrderQuantity = createSelector(
  newInsuranceOrderQuantity,
  (newInsuranceOrderQuantity) => newInsuranceOrderQuantity
);
