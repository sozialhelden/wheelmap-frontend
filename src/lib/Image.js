// @flow

export type ImageContext = 'place' | 'event' | 'app' | 'organization';

export interface IImage {
  _id?: string;
  objectId?: string;
  hashedIp: string;
  context: ImageContext;
  type?: string;
  moderationRequired: boolean;
  reports?: { hashedIp: string, reason: string, timestamp: Date }[];
  dimensions: { width: number, height: number };
  appToken: string;
  timestamp: Date;
  updatedAt?: Date;
  mimeType: string;
  remotePath: string;
  s3Error?: any;
  isUploadedToS3: boolean;
}

export function buildFullImageUrl(image) {
  //FIXME where do we get the s3 settings from?
  const s3 = Meteor.settings.public.aws.s3;

  if (s3.bucketEndpoint) {
    return `${s3.bucketEndpoint}/${image.remotePath}`;
  }
  return `https://${s3.bucket}.s3.amazonaws.com/${image.remotePath}`;
}
