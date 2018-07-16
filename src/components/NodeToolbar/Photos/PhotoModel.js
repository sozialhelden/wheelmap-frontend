// @flow

export type PhotoModel = {
  src: string,
  srcSet: string[],
  sizes: string[],
  width: number,
  height: number,
  imageId: string | number,
  source: 'wheelmap' | 'accessibility-cloud' | 'generated'
};
