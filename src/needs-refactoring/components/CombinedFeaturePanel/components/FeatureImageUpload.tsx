import { Button, Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { Camera } from "lucide-react";
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
import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import { FeaturePanelContext } from "~/needs-refactoring/components/CombinedFeaturePanel/FeaturePanelContext";
import { ImageUploadCallToAction } from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCallToAction";
import { ImageUploadCriteriaList } from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCriteriaList";
import {
  ImageUploadDropzone,
  type ImageWithPreview,
} from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadDropzone";
import { ImageUploadPreview } from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadPreview";
import { ImageUploadProgress } from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadProgress";
import { ImageUploadSuccess } from "~/needs-refactoring/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadSuccess";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";

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
    if (!isDialogOpen && step === 4) {
      setStep(1);
      setImage(undefined);
    }
  }, [isDialogOpen]);

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

  // Reset the url when closing the dialog. This is not using react router on purpose.
  // When using react-router it will re-render the whole FeaturePanel, because it's a
  // new page. This introduces lag, and we want the dialog to open immediately after
  // clicking on the image. This is temporary, the proper solution should be to use
  // a catch-all router in the `[placeType]/[id]/index.tsx` and handle different
  // nested-routes like image upload or fullscreen image there, without re-rendering
  // the whole FeaturePanel.
  // TODO: replace with catch-all route
  useEffect(() => {
    if (!isDialogOpen && window.location.pathname !== baseFeatureUrl) {
      window.history.replaceState(null, document.title, baseFeatureUrl);
    }
  }, [isDialogOpen]);

  // Set the url when opening the dialog
  useEffect(() => {
    if (isDialogOpen && window.location.pathname !== baseUploadUrl) {
      window.history.replaceState(null, document.title, baseUploadUrl);
    }
  }, [isDialogOpen]);

  return (
    <ImageUploadContext.Provider value={api}>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <Flex mt="2" align="center">
          <Dialog.Trigger>
            <Button variant="solid" asChild>
              <AppStateAwareLink
                href={baseUploadUrl}
                onClick={handleOnClickAddImageButton}
              >
                <Camera size={18} aria-hidden /> {t("Add new image")}
              </AppStateAwareLink>
            </Button>
          </Dialog.Trigger>
          <ImageUploadCallToAction />
        </Flex>
        <Dialog.Content>
          <Dialog.Title>
            {step === 1 && t("Add a new image")}
            {step === 2 && t("Select an image")}
            {step === 3 && t("Review your selected image")}
            {step === 4 && t("Upload successful")}
          </Dialog.Title>

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
