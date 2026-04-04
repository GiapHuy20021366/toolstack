let count = 0;
export const getUID = (prefix?: string) => {
  return `${prefix ? prefix + "_" : "ID_"}${Date.now()}${++count}`;
};
