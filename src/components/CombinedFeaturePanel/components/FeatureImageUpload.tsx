import { CameraIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, {
  createContext,
  type FC,
  type MouseEventHandler,
  useCallback,
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
import { ImageUploadSuccess } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadSuccess";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

type ImageUploadType = {
  baseUploadUrl: string;
  step: number;
  nextStep: () => void;
  previousStep: () => void;
  image?: ImageWithPreview;
  setImage: (image?: ImageWithPreview) => void;
  open: () => void;
  close: () => void;
};
export const ImageUploadContext = createContext<ImageUploadType>({
  baseUploadUrl: "",
  step: 1,
  nextStep() {},
  previousStep() {},
  image: undefined,
  setImage(image) {},
  open() {},
  close() {},
});

export const FeatureImageUpload: FC<{
  feature: AnyFeature;
  isUploadDialogOpen?: boolean;
}> = ({ feature, isUploadDialogOpen }) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const router = useRouter();

  const [step, setStep] = useState<number>(1);
  const [image, setImage] = useState<ImageWithPreview>();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(
    Boolean(isUploadDialogOpen),
  );

  const baseUploadUrl = useMemo(() => {
    return `${baseFeatureUrl}/images/upload`;
  }, [baseFeatureUrl]);

  const open = useCallback(() => {
    setIsDialogOpen(true);
  }, []);
  const close = useCallback(() => {
    setIsDialogOpen(false);
  }, []);
  const nextStep = useCallback(() => {
    if (step < 4) setStep(step + 1);
  }, [step]);
  const previousStep = useCallback(() => {
    if (step > 1) setStep(step - 1);
  }, [step]);

  const handleOnClickAddImageButton: MouseEventHandler = useCallback(
    (event) => {
      event.preventDefault();
      open();
    },
    [],
  );

  const api: ImageUploadType = {
    step,
    baseUploadUrl,
    nextStep,
    previousStep,
    image,
    setImage,
    open,
    close,
  };

  const confirmWindowUnload = useCallback((event: Event) => {
    event.preventDefault();
  }, []);

  useEffect(() => {
    if (image) {
      window.addEventListener("beforeunload", confirmWindowUnload);
    } else {
      window.removeEventListener("beforeunload", confirmWindowUnload);
    }
    return () => {
      window.removeEventListener("beforeunload", confirmWindowUnload);
    };
  }, [image, confirmWindowUnload]);

  // Reset the url when closing the dialog
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!isDialogOpen && window.location.pathname !== baseFeatureUrl) {
      router.push(baseFeatureUrl, undefined, { shallow: true });
    }
  }, [isDialogOpen]);

  // Set the url when opening the dialog
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (isDialogOpen && window.location.pathname !== baseUploadUrl) {
      router.push(baseUploadUrl, undefined, { shallow: true });
    }
  }, [isDialogOpen]);

  return (
    <ImageUploadContext.Provider value={api}>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Flex mt="2" align="center">
          <Dialog.Trigger>
            <Button variant="solid" asChild>
              <AppStateLink
                href={baseUploadUrl}
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
            <ImageUploadProgress uploadStep={step} />
          </Dialog.Description>

          {step === 1 && <ImageUploadCriteriaList />}
          {step === 2 && <ImageUploadDropzone />}
          {step === 3 && <ImageUploadPreview feature={feature} />}
          {step === 4 && <ImageUploadSuccess />}
        </Dialog.Content>
      </Dialog.Root>
    </ImageUploadContext.Provider>
  );
};
