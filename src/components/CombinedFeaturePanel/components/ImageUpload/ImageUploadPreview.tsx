import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import {
  AspectRatio,
  Box,
  Button,
  Card,
  Flex,
  Inset,
  Spinner,
  Strong,
  Text,
} from "@radix-ui/themes";
import React, { type FC, useContext, useState } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import { useCurrentAppToken } from "~/lib/context/AppContext";
import uploadPhotoForFeature from "~/lib/fetchers/ac/refactor-this/postImageUpload";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

const uncachedUrl =
  process.env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_UNCACHED_BASE_URL || "";

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
    background: rgba(0, 0, 0, 0.7);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem;
    flex-direction: column;
    gap: .5rem;
  }
`;

export const ImageUploadPreview: FC<{
  feature: AnyFeature;
}> = ({ feature }) => {
  const appToken = useCurrentAppToken();
  const { image, setImage, previousStep, nextStep } =
    useContext(ImageUploadContext);

  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [error, setError] = useState<Error>();

  const cleanUp = () => {
    URL.revokeObjectURL(image.preview);
  };
  const reset = () => {
    setImage(undefined);
    previousStep();
  };
  const upload = async () => {
    setIsUploading(true);
    try {
      await uploadPhotoForFeature(
        feature,
        [image] as unknown as FileList,
        appToken,
        uncachedUrl,
      );
      nextStep();
    } catch (error) {
      setError(error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <>
      <ImagePreview>
        {isUploading && (
          <Box className="image-upload-review__overlay">
            <Spinner size="3" />
            <Text>
              <Strong>{t`Uploading image, please wait...`}</Strong>
            </Text>
          </Box>
        )}
        {error && (
          <Box className="image-upload-review__overlay">
            <ExclamationTriangleIcon color="red" width="40" height="40" />
            <Text>
              <Strong>{t`There was an error uploading your image!`}</Strong>
            </Text>
            <Text>{t`Please try again later.`}</Text>
            <Text color="gray" align="center" mt="6">
              {error.toString()}
            </Text>
          </Box>
        )}
        <Card>
          <Inset>
            <AspectRatio ratio={4 / 3}>
              {image && (
                <img
                  className="image-upload-review__preview-image"
                  src={image.preview.toString()}
                  onLoad={cleanUp}
                  // biome-ignore lint/a11y/noRedundantAlt: We cannot provide a proper alt-text for something the user just uploaded themselves
                  alt={t`Preview of the just selected image`}
                />
              )}
            </AspectRatio>
          </Inset>
        </Card>
      </ImagePreview>
      <Flex mt="4" justify="between" wrap="wrap" gap="3">
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
