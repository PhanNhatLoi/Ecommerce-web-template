import { USED_CAR_TRADING_APPOINTMENT_STATUS } from '~/configs/status/used-car-trading/usedCarAppointmentStatus';

export const GET_CAR_APPOINMENT = 'carTrading/GET_CAR_APPOINMENT';
export const GET_CAR_APPOINMENT_DETAIL = 'carTrading/GET_CAR_APPOINMENT_DETAIL';

export type carTradingAppointmentListResponseType = {
  id: number;
  buyerId: string;
  buyerName: string;
  phone: string;
  carTradingId: number;
  carTradingName: string;
  sellerId: string;
  sellerName: string;
  appointmentDate: string;
  appointStatus: keyof typeof USED_CAR_TRADING_APPOINTMENT_STATUS;
};
