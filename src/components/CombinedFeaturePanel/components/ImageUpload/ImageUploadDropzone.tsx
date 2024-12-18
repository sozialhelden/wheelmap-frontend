import { Box, Button, Strong, Text } from "@radix-ui/themes";
import React, { type FC, useCallback, useContext, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { t } from "ttag";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";

const Dropzone = styled.div<{ $isDragActive?: boolean }>`
  padding: 3rem 4rem;
  border-style: dashed;
  border-width: 2px;
  border-color: var(--accent-9);
  border-radius: var(--radius-4);
  background: ${(props) => (props.$isDragActive ? "var(--accent-3)" : "var(--gray-3)")};
  transition: all 100ms ease;
  text-align: center;
  
  &:hover {
    border-color: var(--accent-11);
  }
  
  &:after {
    border: none;
    outline: none;
  }
`;

export type ImageWithPreview = File & {
  preview: URL;
};

export const ImageUploadDropzone: FC = () => {
  const { setImage, nextStep, previousStep } = useContext(ImageUploadContext);

  const onDrop = useCallback(
    ([file]) => {
      const image = Object.assign(file, {
        preview: URL.createObjectURL(file),
      });
      setImage(image);
      nextStep();
    },
    [setImage, nextStep],
  );
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    maxFiles: 1,
    accept: {
      "image/*": [],
    },
  });

  return (
    <>
      <Dropzone {...getRootProps()} $isDragActive={isDragActive}>
        <input {...getInputProps()} />
        <Text as="p">
          <Strong>{t`Drag an image here to select it`}</Strong>
        </Text>
        <Text as="p" color="gray">{t`or click the select button.`}</Text>
        <Button variant="soft" mt="2">{t`Select image`}</Button>
      </Dropzone>

      <Box mt="4">
        <Button variant="soft" color="gray" size="3" onClick={previousStep}>
          {t`Back`}
        </Button>
      </Box>
    </>
  );
};
