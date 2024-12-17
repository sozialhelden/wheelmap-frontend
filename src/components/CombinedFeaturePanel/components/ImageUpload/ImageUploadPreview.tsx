import {
  AspectRatio,
  Box,
  Button,
  Card,
  Flex,
  Inset,
  Progress,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import React, { type FC, useState } from "react";
import styled from "styled-components";
import { t } from "ttag";
import type { ImageWithPreview } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadDropzone";

const ImagePreview = styled.div`
    position: relative;
    
    .image-upload-review__preview-image {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  
  .image-upload-review__overlay {
    position: absolute;
    inset: 0;
    z-index: 1;
    background: rgba(0,0,0,0.7);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem;
  }
`;

export const ImageUploadPreview: FC<{
  image: ImageWithPreview;
  setImage: (image?: ImageWithPreview) => void;
}> = ({ image, setImage }) => {
  const [isUploading, setIsUploading] = useState(false);
  const cleanUp = () => {
    URL.revokeObjectURL(image.preview);
  };
  const reset = () => {
    setImage(undefined);
  };
  const upload = () => {
    setIsUploading(true);
  };

  return (
    <>
      <Text as="p" mb="4">{t`Please review your selected image:`}</Text>
      <ImagePreview>
        {isUploading && (
          <Box className="image-upload-review__overlay">
            <Progress size="3" value={50} variant="soft" />
          </Box>
        )}
        <Card>
          <Inset>
            <AspectRatio ratio={4 / 3}>
              {image && (
                <img
                  className="image-upload-review__preview-image"
                  src={image.preview}
                  onLoad={cleanUp}
                  // biome-ignore lint/a11y/noRedundantAlt: We cannot provide a proper alt-text for something the user just uploaded themselves
                  alt={t`Preview of the just selected image`}
                />
              )}
            </AspectRatio>
          </Inset>
        </Card>
      </ImagePreview>
      <Flex mt="4" justify="between">
        <Button
          color="gray"
          onClick={reset}
          variant="soft"
          disabled={isUploading}
        >
          {t`Choose a different image`}
        </Button>
        <Button loading={isUploading} onClick={upload}>
          {t`Upload image`}
        </Button>
      </Flex>
    </>
  );
};
