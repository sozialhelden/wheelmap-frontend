import { Box, Grid, Progress, Text } from "@radix-ui/themes";
import React, { type FC } from "react";
import { t } from "ttag";
import { ImageUploadProgressItem } from "~/components/CombinedFeaturePanel/components/ImageUpload/ImageUploadProgressItem";

export const ImageUploadProgress: FC<{ uploadStep: number }> = ({
  uploadStep,
}) => {
  return (
    <Box mb="5" aria-hidden>
      <Grid columns="4">
        <ImageUploadProgressItem active={uploadStep === 1}>
          {t`1. Criteria`}
        </ImageUploadProgressItem>
        <ImageUploadProgressItem active={uploadStep === 2}>
          {t`2. Select`}
        </ImageUploadProgressItem>
        <ImageUploadProgressItem active={uploadStep === 3}>
          {t`3. Review`}
        </ImageUploadProgressItem>
        <ImageUploadProgressItem active={uploadStep === 4}>
          {t`4. Done`}
        </ImageUploadProgressItem>
      </Grid>
      <Progress value={uploadStep * 25} size="2" />
    </Box>
  );
};
