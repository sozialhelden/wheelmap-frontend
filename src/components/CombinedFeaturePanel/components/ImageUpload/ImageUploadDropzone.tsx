import { Box, Strong, Text } from "@radix-ui/themes";
import React, { type FC, useCallback, useContext } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";
import { t } from "ttag";
import { ImageUploadContext } from "~/components/CombinedFeaturePanel/components/FeatureImageUpload";
import { PrimaryButton, SecondaryButton } from "~/components/shared/Buttons";

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
const TextForDesktop = styled(Text)`
    @media (hover: none) {
        display: none;
    }
`;
const TextForMobile = styled(Text)`
    display: none;

    @media (hover: none) {
        display: block;
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
        <TextForDesktop as="p" aria-hidden>
          <Strong>{t`Drag an image here to select it`}</Strong>
        </TextForDesktop>
        <TextForDesktop as="p" color="gray" aria-hidden>
          {t`or click the select button.`}
        </TextForDesktop>
        <TextForMobile as="p">
          <Strong>{t`Use the following button to select an image:`}</Strong>
        </TextForMobile>
        <PrimaryButton mt="2">{t`Select image`}</PrimaryButton>
      </Dropzone>

      <Box mt="4">
        <SecondaryButton onClick={previousStep}>{t`Back`}</SecondaryButton>
      </Box>
    </>
  );
};
