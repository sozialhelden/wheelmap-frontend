import { CheckIcon } from "@radix-ui/react-icons";
import { Button, Flex, Strong, Text } from "@radix-ui/themes";
import React, { type FC, useContext } from "react";
import { t } from "ttag";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";

export const ImageUploadSuccess: FC = () => {
  const { close } = useContext(ImageUploadContext);

  return (
    <>
      <Flex direction="column" align="center" justify="center" py="9" px="4">
        <CheckIcon color="green" width="50" height="50" aria-hidden />
        <Text size="4" align="center">
          <Strong>{t`Image uploaded successfully!`}</Strong>
        </Text>
        <Text align="center" mt="2">
          {t`Thank you for your contribution. The image will be checked by our staff before it's visible on Wheelmap. This can take a while, please be patient.`}
        </Text>
      </Flex>
      <Flex justify="end">
        <Button variant="soft" size="3" onClick={close}>
          {t`Continue`}
        </Button>
      </Flex>
    </>
  );
};
