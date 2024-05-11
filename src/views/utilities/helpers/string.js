import { parsePhoneNumber } from 'libphonenumber-js';

export function removeAccents(str) {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D');
}

export function countWords(s) {
  s = s.replace(/(^\s*)|(\s*$)/gi, '');
  s = s.replace(/[ ]{2,}/gi, ' ');
  s = s.replace(/\n /, '\n');
  return s.split(' ').length;
}

export function getStringWithWord(string, n) {
  let str = '';
  for (let i = 1; i <= n; i++) {
    if (i < n) {
      str += getWord(string, i) + ' ';
    } else {
      str += getWord(string, i);
    }
  }
  return str;
}

export function getWord(string, n) {
  var words = string.split(' ');
  return words[n - 1];
}

export function formatImage(imgstr, width, height = 0) {
  let last = imgstr.lastIndexOf('.');
  return imgstr
    .substring(0, last)
    .concat('_')
    .concat(width + 'x' + height)
    .concat(imgstr.substring(last, imgstr.length));
}

export function getAlias(str) {
  return removeAccents(str || '')
    .toLowerCase()
    .replace(/[^a-zA-Z0-9 ]/g, ' ')
    .replace(/\s{1,}/g, '-');
}

export const getKeyForDateFilter = (key, type) => {
  let keySplit = key.split('Date');
  keySplit[keySplit.length - 1] = type;
  return keySplit.join('') + 'Date';
};

export function replaceVniToEng(str) {
  str = str?.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, 'a');
  str = str?.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, 'e');
  str = str?.replace(/ì|í|ị|ỉ|ĩ/g, 'i');
  str = str?.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, 'o');
  str = str?.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, 'u');
  str = str?.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, 'y');
  str = str?.replace(/đ/g, 'd');
  str = str?.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, 'A');
  str = str?.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, 'E');
  str = str?.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, 'I');
  str = str?.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, 'O');
  str = str?.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, 'U');
  str = str?.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, 'Y');
  str = str?.replace(/Đ/g, 'D');
  // Some system encode vietnamese combining accent as individual utf-8 characters
  // Một vài bộ encode coi các dấu mũ, dấu chữ như một kí tự riêng biệt nên thêm hai dòng này
  str = str?.replace(/\u0300|\u0301|\u0303|\u0309|\u0323/g, ''); // ̀ ́ ̃ ̉ ̣  huyền, sắc, ngã, hỏi, nặng
  str = str?.replace(/\u02C6|\u0306|\u031B/g, ''); // ˆ ̆ ̛  Â, Ê, Ă, Ơ, Ư
  // Remove extra spaces
  // Bỏ các khoảng trắng liền nhau
  str = str?.replace(/ + /g, ' ');
  str = str?.trim();
  // Remove punctuations
  // Bỏ dấu câu, kí tự đặc biệt
  str = str?.replace(/!|@|%|\^|\*|\(|\)|\+|\=|\<|\>|\?|\/|,|\.|\:|\;|\'|\"|\&|\#|\[|\]|~|\$|_|`|-|{|}|\||\\/g, ' ');
  return str;
}

export function formatPhoneNumber(phoneNumberString) {
  var cleaned = ('' + phoneNumberString).replace(/\D/g, '');
  var match = cleaned.match(/^(\d{2})(\d{3})(\d{3})(\d{3})$/);
  if (match) {
    return `(+${match[1]}) ${match[2]}-${match[3]}-${match[4]}`;
  }
  return phoneNumberString;
}

export function formatPhoneWithCountryCode(input, _countryCode = 'VN') {
  const inputFormatted = input?.replace(/\D/g, '');
  let phoneNumber = inputFormatted && !isNaN(inputFormatted) ? parsePhoneNumber(inputFormatted, _countryCode).number : '000';
  var cleaned = ('' + phoneNumber).replace(/\D/g, '');
  let formatted = cleaned;
  const countryCodeLength = _countryCode === 'VN' ? 2 : 1;
  const primaryPart = cleaned?.length - countryCodeLength - 4;

  // total parts of the phone number
  // i.e: 123 456 7890 -> 4 parts
  const totalParts = Math.round(primaryPart / 3);
  formatted = `(+${cleaned.slice(0, countryCodeLength)}) `;

  let startingPoint = countryCodeLength;
  for (let i = 0; i < totalParts; i++) {
    if (i === 0 && primaryPart % 3 !== 0) {
      formatted += cleaned.slice(startingPoint, startingPoint + 2);
      startingPoint += 2;
    } else {
      formatted += cleaned.slice(startingPoint, startingPoint + 3);
      startingPoint += 3;
    }
    formatted += ' ';
  }
  formatted += cleaned.slice(startingPoint);
  return formatted;
}

export function isJsonString(string) {
  if (string === null || string === undefined) {
    return false;
  }
  return /^[\],:{}\s]*$/.test(
    (string || '')
      .replace(/\\["\\\/bfnrtu]/g, '@')
      .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
      .replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  );
}

export function formatPhoneNumberToVn(input) {
  let phoneRemoveWhiteSpace = input?.toString()?.replace(/\D/g, '');

  if (phoneRemoveWhiteSpace[0] === '8' && phoneRemoveWhiteSpace[1] === '4') phoneRemoveWhiteSpace = phoneRemoveWhiteSpace.slice(2);
  if (phoneRemoveWhiteSpace[0] === '0') phoneRemoveWhiteSpace = phoneRemoveWhiteSpace.slice(1);

  return {
    value: '0' + phoneRemoveWhiteSpace,
    label: '84' + phoneRemoveWhiteSpace
  };
}
