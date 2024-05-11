//
// Type of Used Car Trading
//

// status car
export type StatusCarTrading = 'WAITING_FOR_APPROVAL' | string;

type BasicType = {
  id: number;
  name: string;
};

//vericle type
export type vehicleInfoResponseType = {
  id: number;
  seat: number;
  door: number;
  engine: string;
  producingYear: number;
  length: number;
  width: number;
  heigh: number;
  license: string;
  ownerdBy: string;
  userId: number;
  profileId: number;
  hashCode: string;
  chassisNumber: string;
  vehicleBusinessType: string;
  images: string;
  vehicleTypeId: number;
  brandId: number;
  modelId: number;
  gearboxTypeId: number;
  fuelTypeId: number;
  bodyTypeId: number;
  loadCapacityId: number;
  colorId: number;
  travelledDistance: number;
  vehicleTypeName: string;
  brandName: string;
  modelName: string;
  gearboxTypeName: string;
  fuelTypeName: string;
  bodyTypeName: string;
  loadCapacityName: string;
  colorName: string;
  langCode: 'vi' | 'en';
  media: { url: string; type: 'IMAGE' | 'VIDEO' }[];
  vehicleType: BasicType;
  model: BasicType;
  bodyType: BasicType;
  gearboxType: BasicType;
  fuelType: BasicType;
  loadCapacity: BasicType;
  color: BasicType;
  brand: BasicType;
};

// profile info
export type profileInfoCacheResponseType = {
  name: string;
  phone: string;
  phoneCode: string;
  address: string;
  countryId: number;
  districtId: number;
  fullAddress: string;
  provinceId: number;
  stateId: number;
  wardsId: number;
  zipCode: string;
};

//used car trading list response
export type UsedCarTradingListResponseType = {
  id: number;
  code: string;
  hashCode: string;
  title: string;
  description: string;
  price: number;
  viewCount: number;
  status: StatusCarTrading;
  censorshipStatus: StatusCarTrading;
  profileId: number;
  userId: number;
  vehicleInfoId: number;
  vehicleInfo: vehicleInfoResponseType;
  note: string;
  rejectReason: any;
  createdDate: string;
  lastModifiedDate: string;
  isSaved: boolean;
  profileInfoCache: profileInfoCacheResponseType;
};
