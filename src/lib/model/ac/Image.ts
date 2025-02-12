export type ImageContext = "place" | "event" | "app" | "organization";

export interface IImage {
  _id?: string;
  objectId?: string;
  hashedIp: string;
  context: ImageContext;
  type?: string;
  moderationRequired: boolean;
  reports?: { hashedIp: string; reason: string; timestamp: Date }[];
  dimensions: { width: number; height: number };
  appToken: string;
  timestamp: Date;
  updatedAt?: Date;
  mimeType: string;
  remotePath: string;
  s3Error?: unknown;
  isUploadedToS3: boolean;
  angle?: number;
}

export function buildFullImageUrl(image: IImage) {
  const bucketName = process.env.NEXT_PUBLIC_AWS_S3_BUCKET_NAME || "";

  return `https://${bucketName}.s3.amazonaws.com/${image.remotePath}`;
}
