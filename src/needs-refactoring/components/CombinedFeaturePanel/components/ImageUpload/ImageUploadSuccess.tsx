import { Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import React, { type FC, useContext } from "react";
import { PrimaryButton } from "~/components/button/PrimaryButton";
import { SuccessResult } from "~/components/results/SuccessResult";
import { ImageUploadContext } from "~/needs-refactoring/components/CombinedFeaturePanel/components/FeatureImageUpload";

export const ImageUploadSuccess: FC = () => {
  const { close } = useContext(ImageUploadContext);

  return (
    <>
      <SuccessResult
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
