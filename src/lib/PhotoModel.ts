import { Photo } from 'react-photo-album';

export type PhotoModel = Photo & {
  _id: string;
  appSource: 'wheelmap' | 'accessibility-cloud' | 'generated';
  angle: number;
};
