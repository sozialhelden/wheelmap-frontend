import {
  AspectRatio,
  Box,
  Button,
  Card,
  Flex,
  Grid,
  Inset,
  Strong,
  Text,
  TextArea,
  Tooltip,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { type FC, useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { t } from "ttag";

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

export const ImageUploadDropzone: FC<{
  setImage: (image: ImageWithPreview) => void;
}> = ({ setImage }) => {
  const router = useRouter();

  const onDrop = useCallback(([file]) => {
    setImage(
      Object.assign(file, {
        preview: URL.createObjectURL(file),
      }),
    );
  }, []);
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
        <Button variant="soft" color="gray" size="3" onClick={router.back}>
          {t`Back`}
        </Button>
      </Box>
    </>
  );
};
