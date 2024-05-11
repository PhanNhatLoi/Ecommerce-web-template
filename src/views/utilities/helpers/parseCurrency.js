import { isNumber } from 'lodash-es';

const parseCurrency = (value, sign = 'đ', fractionDigits = 0) => {
  if (isNumber(value)) {
    let formatedValue = value.toLocaleString(undefined, { minimumFractionDigits: fractionDigits, maximumFractionDigits: fractionDigits });
    return [formatedValue, sign].filter((item) => (item || '').trim().length > 0).join(' ');
  }
  return '';
};

export default parseCurrency;
