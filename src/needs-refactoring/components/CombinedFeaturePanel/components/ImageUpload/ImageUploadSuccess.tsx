import { Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { type FC, useContext } from "react";
import { ImageUploadContext } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureImageUpload";
import { SuccessScreen } from "~/needs-refactoring/components/shared/SuccessScreen";
import { PrimaryButton } from "~/components/button/PrimaryButton";

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
