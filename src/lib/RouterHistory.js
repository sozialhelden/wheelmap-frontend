// @flow

export interface RouterHistory {
  push(name: string, params?: { [name: string]: any }): void;
}
