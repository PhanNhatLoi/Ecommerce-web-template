// import { string } from 'bfj/src/events';
import React from 'react';
import { Trans } from 'react-i18next';

// --------------------------
// VALIDATE CONSTANT
// --------------------------
export const MAX_LENGTH = 255;

/** Regex Validation **/
// eslint-disable-next-line no-useless-escape
const regPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{3,6}$/;
const regName =
  /^[a-zA-ZÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠàáâãèéêìíòóôõùúăđĩũơƯĂẠẢẤẦẨẪẬẮẰẲẴẶẸẺẼỀỀỂẾưăạảấầẩẫậắằẳẵặẹẻẽềềểếỄỆỈỊỌỎỐỒỔỖỘỚỜỞỠỢỤỦỨỪễệỉịọỏốồổỗộớờởỡợụủứừỬỮỰỲỴÝỶỸửữựỳỵỷỹý&\d\-_.,\s]+$/;
// const regEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
const regPassword = /^(?!.* )/i;
// const regEmailOrPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$|^[A-Z0-9._%-]+[+\w-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
const regNoSpecialCharacters = /^[a-zA-Z0-9]+$/;

export const commonValidate = () => [
  {
    required: true,
    message: <Trans i18nKey="required_field" />
  }
];

export const passwordValidate = (min = 1) => [
  {
    min: min,
    message: <Trans i18nKey="min_syms" values={{ value: min }} />
  }
];

export const numberValidate = (number, min = 1) => {
  return {
    validateStatus: 'error',
    errorMsg: <Trans i18nKey="min_syms" values={{ value: min }} />
  };
};

export const min = (amount, message = `Must be at least ${amount}`) => {
  return [{ min: amount, message: message }];
};

export const max = (amount, message = `Must be at most ${amount}`) => {
  return [{ max: amount, message: message }];
};

export const phoneValidate = () => [{ pattern: regPhone, message: <Trans i18nKey="phone_invalid" /> }];
export const nameValidate = () => [{ pattern: regName, message: <Trans i18nKey="name_invalid" /> }];
// for password
export const whiteSpaceValidate = () => [{ pattern: regPassword, message: <Trans i18nKey="required_field" /> }];
export const noSpecialCharactersValidate = () => [
  { pattern: regNoSpecialCharacters, message: <Trans i18nKey="no_special_character_field" /> }
];

export const typeValidate: any = (type = 'string') => {
  let message;
  switch (type) {
    case 'number':
      message = <Trans i18nKey="wrong_number" />;
      break;
    case 'boolean':
      message = <Trans i18nKey="wrong_boolean" />;
      break;
    case 'email':
      message = <Trans i18nKey="wrong_email" />;
      break;
    case 'url':
      message = <Trans i18nKey="wrong_url" />;
      break;
    default:
      message = <Trans i18nKey="wrong_string" />;
      break;
  }
  return [
    {
      type,
      message
    }
  ];
};
