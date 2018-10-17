// @flow

export type PhotoModel = {
  original: string,
  src: string,
  srcSet: string[],
  sizes: string[],
  thumbnailSrcSet?: string[],
  thumbnailSizes?: string[],
  width: number,
  height: number,
  imageId: string | number,
  source: 'wheelmap' | 'accessibility-cloud' | 'generated',
};
