import { Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { type FC, useContext } from "react";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import { PrimaryButton } from "~/components/shared/Buttons";
import { SuccessScreen } from "~/components/shared/SuccessScreen";

export const ImageUploadSuccess: FC = () => {
  const { close } = useContext(ImageUploadContext);

  return (
    <>
      <SuccessScreen
        heading={t("Image uploaded successfully!")}
        text={t(
          `Thank you for your contribution. The image will be checked by our staff before it's visible on Wheelmap. This can take a while, please be patient.`,
        )}
      />
      <Flex justify="end">
        <PrimaryButton onClick={close}>{t("Continue")}</PrimaryButton>
      </Flex>
    </>
  );
};
