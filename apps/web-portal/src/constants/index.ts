export * from "./storageKeys"
export * from '@apps/auth/constants'

export const DEBOUNCE_TIME = 500;
export const MIN_DEVICE_WIDTH = 1400; //Chiều rộng tối thiểu màn hình

export const LANGUAGE = {
  VN: "VN", //Tiếng Việt
  EN: "EN", //Tiếng Anh
  CN: "CN", //Tiếng Trung
  JP: "JP", //Tiếng Nhật
  KR: "KR"  //Tiếng Hàn
}

export const LANGUAGE_REQUEST = {
  vi: LANGUAGE['VN'],
  en: LANGUAGE['EN'],
  cn: LANGUAGE['CN'],
  jp: LANGUAGE['JP'],
  kr: LANGUAGE['KR'],
}