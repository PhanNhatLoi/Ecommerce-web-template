const convertPx = (number: string | number) => {
  if (typeof number === 'string') {
    if (number.includes('px')) {
      return number;
    } else {
      return `${number}px`;
    }
  }

  return `${number}px`;
};

export { convertPx };
