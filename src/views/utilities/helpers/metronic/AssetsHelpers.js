export function removeCSSClass(ele, cls) {
  const reg = new RegExp('(\\s|^)' + cls + '(\\s|$)');
  ele.className = ele.className.replace(reg, ' ');
}

export function addCSSClass(ele, cls) {
  ele.classList.add(cls);
}

export const toAbsoluteUrl = (pathname) => process.env.PUBLIC_URL + pathname;

export const getOptions = (objectStatus, t) => {
  let options = {};
  Object.keys(objectStatus).map((o) => {
    options = Object.assign(options, { [objectStatus[o]]: t(objectStatus[o]) });
  });
  return options;
};
