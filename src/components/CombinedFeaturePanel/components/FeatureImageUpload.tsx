import { CameraIcon } from "@radix-ui/react-icons";
import { Button, Dialog, Flex } from "@radix-ui/themes";
import React, {
  type FC,
  type MouseEventHandler,
  useContext,
  useRef,
  useState,
} from "react";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { ImageUploadCallToAction } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCallToAction";
import { ImageUploadCriteriaList } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadCriteriaList";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";

export const FeatureImageUpload: FC<{
  feature: AnyFeature;
  isUploadDialogOpen?: boolean;
}> = ({ feature, isUploadDialogOpen }) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  const [dialogOpen, setDialogOpen] = useState(isUploadDialogOpen);

  const open = () => {
    setDialogOpen(true);
  };
  const close = () => {
    setDialogOpen(false);
  };

  const linkRef = useRef(null);
  const handleOnClickAddImageButton: MouseEventHandler = (event) => {
    event.preventDefault();
    open();
  };

  return (
    <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
      <Flex mt="2" align="center">
        <Dialog.Trigger>
          <Button variant="solid" asChild>
            <AppStateLink
              href={`${baseFeatureUrl}/images/upload`}
              onClick={handleOnClickAddImageButton}
            >
              <CameraIcon /> {t`Add new image`}
            </AppStateLink>
          </Button>
        </Dialog.Trigger>
        <ImageUploadCallToAction />
      </Flex>
      <Dialog.Content>
        <Dialog.Title>{t`Add new image`}</Dialog.Title>
        <Dialog.Description>{t`Before uploading a new image, please make sure that the image meets the following criteria:`}</Dialog.Description>
        <>
          <ImageUploadCriteriaList />
          <Flex justify="between" mt="6">
            <Button variant="soft" color="gray" size="3" onClick={close}>
              {t`Cancel`}
            </Button>
            <Button size="3">{t`Continue`}</Button>
          </Flex>
        </>
      </Dialog.Content>
    </Dialog.Root>
  );
};
