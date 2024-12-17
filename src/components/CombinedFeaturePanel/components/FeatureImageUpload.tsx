import { CameraIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, {
  type FC,
  type MouseEventHandler,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { ImageUploadCallToAction } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCallToAction";
import { ImageUploadCriteriaList } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCriteriaList";
import {
  ImageUploadDropzone,
  type ImageWithPreview,
} from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadDropzone";
import { ImageUploadPreview } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadPreview";
import { ImageUploadProgress } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadProgress";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

export const FeatureImageUpload: FC<{
  feature: AnyFeature;
  isUploadDialogOpen?: boolean;
  uploadStep?: string;
}> = ({ feature, isUploadDialogOpen, uploadStep: unsanitizedUploadStep }) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const router = useRouter();

  const [uploadStep, setUploadStep] = useState<number>(0);
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(
    Boolean(isUploadDialogOpen),
  );
  const [image, setImage] = useState<ImageWithPreview>();

  const uploadUrl = useMemo(() => {
    return `${baseFeatureUrl}/images/upload`;
  }, [baseFeatureUrl]);

  const open = () => {
    setIsDialogOpen(true);
  };
  const close = () => {
    setIsDialogOpen(false);
  };

  const handleOnClickAddImageButton: MouseEventHandler = (event) => {
    event.preventDefault();
    open();
  };

  // Set the initial upload step from the url query parameter. We don't
  // want to navigate to steps 3 or 4 via query parameter and only with
  // user interaction with the forms, that's why it is sanitized here
  useEffect(() => {
    const uploadStep = Number.parseInt(unsanitizedUploadStep ?? "1");
    setUploadStep(
      !uploadStep || uploadStep > 2 || uploadStep < 0 ? 1 : uploadStep,
    );
  }, [unsanitizedUploadStep]);

  // Reset the url when closing the dialog
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!isDialogOpen && window.location.pathname !== baseFeatureUrl) {
      router.push(baseFeatureUrl);
    }
  }, [isDialogOpen]);

  // Set the url when opening the dialog
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (isDialogOpen && window.location.pathname !== uploadUrl) {
      router.push(uploadUrl, undefined, { shallow: true });
    }
  }, [isDialogOpen]);

  // Continue to step 3 when the image gets selected
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (isDialogOpen && image && uploadStep === 2) {
      setUploadStep(3);
    }
  }, [image]);

  // Continue to step 2 when the image gets reset
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (isDialogOpen && !image && uploadStep === 3) {
      setUploadStep(2);
    }
  }, [image]);

  return (
    <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <Flex mt="2" align="center">
        <Dialog.Trigger>
          <Button variant="solid" asChild>
            <AppStateLink
              href={uploadUrl}
              onClick={handleOnClickAddImageButton}
            >
              <CameraIcon /> {t`Add new image`}
            </AppStateLink>
          </Button>
        </Dialog.Trigger>
        <ImageUploadCallToAction />
      </Flex>
      <Dialog.Content>
        <Dialog.Title>{t`Add a new image`}</Dialog.Title>

        <Dialog.Description>
          <ImageUploadProgress uploadStep={uploadStep} />
        </Dialog.Description>

        {uploadStep === 1 && <ImageUploadCriteriaList uploadUrl={uploadUrl} />}
        {uploadStep === 2 && <ImageUploadDropzone setImage={setImage} />}
        {uploadStep === 3 && (
          <ImageUploadPreview image={image} setImage={setImage} />
        )}
      </Dialog.Content>
    </Dialog.Root>
  );
};
