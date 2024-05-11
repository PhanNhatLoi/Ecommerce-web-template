/*eslint-disable */
import React from 'react';
import { Trans } from 'react-i18next';
import * as yup from 'yup';

/** Regex Validation **/
export const isPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/;
export const isEmail = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
export const isEmailOrPhone = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$|^[A-Z0-9._%-]+[+\w-]+@[A-Z0-9.-]+\.[A-Z]{2,10}/i;
export const isPassword = /^(?!.* )/i;

/** Validation */
export const emailValidate = yup
  .string()
  .email(<Trans i18nKey="wrong_email" />)
  .min(3, <Trans i18nKey="min_3_syms" />)
  .max(50, <Trans i18nKey="max_50_syms" />)
  .required(<Trans i18nKey="required_field" />);
export const phoneValidate = yup
  .string()
  .matches(isPhone,'Phone number is not valid') // <Trans i18nKey="phone_invalid" /> 
  .required(<Trans i18nKey="required_field" />)
  .typeError(<Trans i18nKey="phone_invalid" />);
export const phoneValidateNotRequired = yup
  .string()
  .matches(isPhone, 'Phone number is not valid')
  .typeError(<Trans i18nKey="phone_invalid" />);
export const passwordValidate = yup
  .string()
  .min(6, <Trans i18nKey="min_6_syms" />)
  .max(50, <Trans i18nKey="max_50_syms" />)
  .required(<Trans i18nKey="required_field" />);
export const confirmPasswordValidate = yup
  .string()
  .required(<Trans i18nKey="required_field" />)
  .when('password', {
    is: (val) => (val && val.length > 0 ? true : false),
    then: yup.string().oneOf([yup.ref('password')], <Trans i18nKey="pass_not_match" />)
  });

export const otpValidate = yup
  .string()
  .length(6, <Trans i18nKey="exact_6_syms" />)
  .required(<Trans i18nKey="required_field" />);
export const requiredFieldValidate = yup.string().required(<Trans i18nKey="required_field" />);
export const arrayPhoneValidate = yup
  .array()
  .of(phoneValidate)
  .min(1, <Trans i18nKey="min_invite" />);

export const arrayImagesValidate = yup
  .array()
  // .of(requiredFieldValidate)
  .min(1, <Trans i18nKey="min_image_upload" />);

export const arrayValidateWithMessage = (message) => yup.array().min(1, message);
