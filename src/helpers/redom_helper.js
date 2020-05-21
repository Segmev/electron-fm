

export const transformClasses = (classNameArray = []) => {
  return classNameArray.reduce((acc, className) => (`${acc}.${className}`), '');
}
