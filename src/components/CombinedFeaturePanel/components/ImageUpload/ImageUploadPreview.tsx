import {
  AspectRatio,
  Box,
  Card,
  Flex,
  Inset,
  Spinner,
  Strong,
  Text,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { type FC, useContext, useState } from "react";
import styled from "styled-components";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import { PrimaryButton, SecondaryButton } from "~/components/shared/Buttons";
import { ErrorScreen } from "~/components/shared/ErrorScreen";
import uploadPhotoForFeature from "~/lib/fetchers/ac/refactor-this/postImageUpload";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import useAccessibilityCloud from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";

const PreviewWrapper = styled.div`
  position: relative;
`;
const PreviewImage = styled.img`
    width: 100%;
    height: 100%;
    object-fit: contain;
  `;
const PreviewOverlay = styled(Box)`
    position: absolute;
    inset: 0;
    z-index: 1;
    background: var(--gray-surface);
    backdrop-filter: blur(6px);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4rem;
    flex-direction: column;
    gap: .5rem;
`;

export const ImageUploadPreview: FC<{
  feature: AnyFeature;
}> = ({ feature }) => {
  const { baseUrl, appToken } = useAccessibilityCloud({ cached: true });
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
        baseUrl,
        appToken,
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
      <PreviewWrapper>
        <Card>
          {isUploading && (
            <PreviewOverlay>
              <Spinner size="3" />
              <Text>
                <Strong>{t("Uploading image, please wait...")}</Strong>
              </Text>
            </PreviewOverlay>
          )}
          {error && (
            <PreviewOverlay>
              <ErrorScreen
                heading={t("There was an error uploading your image!")}
                text={t("Please try again later.")}
                error={error.toString()}
              />
            </PreviewOverlay>
          )}
          <Inset>
            <AspectRatio ratio={4 / 3}>
              {image && (
                <PreviewImage
                  className="image-upload-review__preview-image"
                  src={image.preview.toString()}
                  onLoad={cleanUp}
                  // We cannot provide a proper alt-text for something the user just uploaded themselves
                  alt={t("Preview of the just selected image")}
                />
              )}
            </AspectRatio>
          </Inset>
        </Card>
      </PreviewWrapper>
      <Flex mt="4" justify="between" wrap="wrap" gap="3">
        <SecondaryButton onClick={reset} disabled={isUploading}>
          {t("Choose a different image")}
        </SecondaryButton>
        <PrimaryButton loading={isUploading} onClick={upload}>
          {t("Upload image")}
        </PrimaryButton>
      </Flex>
    </>
  );
};
