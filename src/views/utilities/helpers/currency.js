import numeral from 'numeral';

const currencyFormat = (number) => {
  if (typeof number === 'number') {
    var myNumeral = numeral(number);
    numeral.defaultFormat('0,0');
    return myNumeral.format() + ' đ';
  }
  return '';
};

const numberFormatWithPoint = (number) => {
  if (typeof number === 'number') {
    var myNumeral = numeral(number);
    numeral.defaultFormat('0,0');
    return myNumeral.format();
  }
  return '';
};

const numberFormatWithPointFloat = (number) => {
  if (typeof number === 'number') {
    var myNumeral = numeral(number);
    numeral.defaultFormat('0,.00');
    return myNumeral.format();
  }
  return '';
};

const numberFormatDecimal = (number, suffix = '', prefix = '') => {
  if (typeof number === 'number') {
    var myNumeral = numeral(number);
    if (parseInt(number) === number) numeral.defaultFormat('0,0');
    else numeral.defaultFormat('0,0.00');
    return `${prefix}` + myNumeral.format() + `${suffix}`;
  }
  return '-';
};

const numberFormatInt = (number, suffix) => {
  if (typeof number === 'number') {
    var myNumeral = numeral(number);
    numeral.defaultFormat('0,0');
    return myNumeral.format() + ` ${suffix}`;
  }
  return '';
};

export { currencyFormat, numberFormatDecimal, numberFormatInt, numberFormatWithPoint, numberFormatWithPointFloat };
