// @flow

export type LocationShape = {
  pathname?: string,
  query?: string | { [string]: any },
};

export type ClientRouter = {
  push(url: string): void,
  push(location: LocationShape): void,
};
