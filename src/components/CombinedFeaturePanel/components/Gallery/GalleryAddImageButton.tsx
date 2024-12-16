import { CameraIcon } from "@radix-ui/react-icons";
import { Button, Flex } from "@radix-ui/themes";
import { type FC, useContext } from "react";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import { FeaturePanelContext } from "~/components/CombinedFeaturePanel/FeaturePanelContext";
import { GalleryCallToAction } from "./GalleryCallToAction";

export const GalleryAddImageButton: FC = () => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);

  return (
    <Flex mt="2" align="center">
      <Button variant="solid" asChild>
        <AppStateLink href={`${baseFeatureUrl}/images/upload`}>
          <CameraIcon /> {t`Add new image`}
        </AppStateLink>
      </Button>
      <GalleryCallToAction />
    </Flex>
  );
};
