export type IResponseObject<K extends string, T> = {
  [P in K]: T;
};
