import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Box,
  Flex,
  IconButton,
  Kbd,
  Text,
  VisuallyHidden,
} from "@radix-ui/themes";
import { CloseIcon } from "next/dist/client/components/react-dev-overlay/internal/icons/CloseIcon";
import { type FC, useContext, useMemo } from "react";
import styled from "styled-components";
import { t } from "ttag";
import GalleryReportPopover from "~/components/CombinedFeaturePanel/components/Gallery/GalleryReportPopover";
import Image from "~/components/Image";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import { GalleryContext } from "./Gallery";

const DialogContentWrapper = styled.div`
  // Essentially the following line imitates what the Inset component does. 
  // Unfortunately, we cannot use the Inset component and set the height to 
  // be fixed at the same time. If you find another better way how to do that, 
  // feel free to change this bumscode™
  margin: calc(var(--dialog-content-padding) * -1);
  
  height: calc(100vh - 4rem);
  grid-template-rows: 1fr auto;
  display: grid;
  overflow: hidden;
  position: relative;
`;
const ImageWrapper = styled.div<{ $width?: number; $height?: number }>`
  position: relative;
  overflow: hidden;
  min-height: 0;
  display: flex;
  align-items: center;
  justify-content: center;

  & > img {
    width: auto;
    height: auto;
    max-height: min(100%, ${(props) => `${props.$height}px`});
    max-width: min(100%, ${(props) => `${props.$width}px`});
  }
`;
const ImageNav = styled.nav`
  position: absolute;
  top: 50%;
  left: 1rem;
  right: 1rem;
  transform: translateY(-50%);
`;
const ImageNavList = styled.ul`
  list-style: none;
  padding: 0;
  display: flex;
  justify-content: space-between;
`;
const ImageFooter = styled(Flex)`
  flex-shrink: 0;
  padding: 0.5rem 1rem;
  border-top: 2px solid var(--gray-7);
`;
const ImageLegend = styled(Flex)`
  @media (hover: none) {
    display: none !important;
  }
`;
const ImageCloseButton = styled(IconButton)`
  position: absolute;
  top: 1rem;
  right: 1rem;
`;

export const GalleryFullscreenItem: FC<{
  image: AccessibilityCloudImage;
}> = ({ image }) => {
  const api = useContext(GalleryContext);

  // TODO: replace in the near future with actual description
  const imageDescription = image?._id;

  return (
    <>
      <VisuallyHidden aria-live="polite">
        {image && t`Image shown: ${imageDescription}`}
      </VisuallyHidden>
      <DialogContentWrapper>
        {image && (
          <ImageWrapper
            $height={image.dimensions.height}
            $width={image.dimensions.width}
          >
            <Image
              image={image}
              key={image._id}
              width={1600}
              sizes="100vw"
              alt={imageDescription}
            />
          </ImageWrapper>
        )}

        <ImageFooter
          justify="between"
          align="center"
          direction={{
            initial: "column-reverse",
            md: "row",
          }}
          gap="2"
          aria-hidden
        >
          <ImageLegend align="center" gap="2">
            <Text color="gray">{t`You can use these keys for navigation:`}</Text>
            <Kbd>←</Kbd>
            <Kbd>→</Kbd>
            <Kbd>ESC</Kbd>
            <Text color="gray" ml="4">{t`To report an image:`}</Text>
            <Kbd>R</Kbd>
          </ImageLegend>
          <Box as="span" />
          <Flex as="span" align="center" gap="6">
            <Text>{t`Image ${api.activeIndex + 1} of ${api.size}`}</Text>{" "}
            <GalleryReportPopover image={image} />
          </Flex>
        </ImageFooter>

        <ImageNav>
          <ImageNavList>
            <li>
              <IconButton color="gray" size="4" onClick={api.previous}>
                <ArrowLeftIcon />
              </IconButton>
            </li>
            <li>
              <IconButton color="gray" size="4" onClick={api.next}>
                <ArrowRightIcon />
              </IconButton>
            </li>
          </ImageNavList>
        </ImageNav>

        <ImageCloseButton color="gray" size="3" onClick={api.close}>
          <CloseIcon />
        </ImageCloseButton>
      </DialogContentWrapper>
    </>
  );
};
