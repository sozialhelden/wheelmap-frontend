import { ArrowLeftIcon, ArrowRightIcon } from "@radix-ui/react-icons";
import {
  Box,
  Button,
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
import { AppStateLink } from "~/components/App/AppStateLink";
import useAccessibilityCloudAPI from "~/lib/fetchers/ac/useAccessibilityCloudAPI";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import { GalleryContext } from "./Gallery";
import { fullScreenSizes, makeSrcSet, makeSrcSetLocation } from "./util";

const DialogContentWrapper = styled.div`
  // Essentially the following lines imitate what the Inset component does. 
  // Unfortunately, we cannot use the Inset component and set the width and 
  // height to be fixed at 100% at the same time. If you find another better 
  // way how to do that, feel free to change this bumscode™
  height: calc(100% + calc(var(--dialog-content-padding) * 2));
  width: calc(100% + calc(var(--dialog-content-padding) * 2));
  margin: calc(var(--dialog-content-padding) * -1);

  display: flex;
  flex-direction: column;

  .gallery__fullscreen-image {
    display: block;
    width: 100%;
    height: 100%;
    object-fit: contain;
  }

  .gallery__fullscreen-nav {
    position: absolute;
    top: 50%;
    left: 1rem;
    right: 1rem;
    transform: translateY(-50%);
  }

  .gallery__fullscreen-nav__list {
    list-style: none;
    padding: 0;
    display: flex;
    justify-content: space-between;
  }

  .gallery__fullscreen-image__footer {
    flex-shrink: 0;
    padding: 0.5rem 1rem;
    border-top: 2px solid var(--gray-7);
  }

  .gallery__fullscreen-image__legend {
    @media (hover: none) {
      display: none !important;
    }
  }

  .gallery__fullscreen-image__close-button {
    position: absolute;
    top: 1rem;
    right: 1rem;
  }
`;

export const GalleryFullscreenItem: FC<{
  image: AccessibilityCloudImage;
}> = ({ image }) => {
  const { baseUrl } = useAccessibilityCloudAPI({ cached: true });
  const api = useContext(GalleryContext);

  const srcSet = useMemo(() => {
    if (!image) return undefined;
    return makeSrcSetLocation(makeSrcSet(baseUrl, fullScreenSizes, image));
  }, [baseUrl, image]);
  const reportUrl = useMemo(() => {
    if (!image) return undefined;
    return api.getReportUrl(image._id);
  }, [image]);

  return (
    <>
      <VisuallyHidden aria-live="polite">{t`Image shown: ${image._id}`}</VisuallyHidden>
      <DialogContentWrapper aria-hidden>
        {srcSet && (
          <img className="gallery__fullscreen-image" srcSet={srcSet} alt="" />
        )}

        <Flex
          className="gallery__fullscreen-image__footer"
          justify="between"
          align="center"
          direction={{
            initial: "column-reverse",
            md: "row",
          }}
          gap="2"
        >
          <Flex
            className="gallery__fullscreen-image__legend"
            as="span"
            align="center"
            gap="2"
          >
            <Text color="gray">{t`You can use these keys for navigation:`}</Text>
            <Kbd>←</Kbd>
            <Kbd>→</Kbd>
            <Kbd>ESC</Kbd>
            <Text color="gray" ml="4">{t`To report an image:`}</Text>
            <Kbd>R</Kbd>
          </Flex>
          <Box as="span" />
          <Flex as="span" align="center" gap="6">
            <Text>{t`Image ${api.activeIndex + 1} of ${api.size}`}</Text>
            <Button asChild color="gray" variant="surface">
              {reportUrl && (
                <AppStateLink href={reportUrl}>{t`Report Image`}</AppStateLink>
              )}
            </Button>
          </Flex>
        </Flex>

        <nav className="gallery__fullscreen-nav">
          <ul className="gallery__fullscreen-nav__list">
            <li className="gallery__fullscreen-nav__list-item">
              <IconButton color="gray" size="4" onClick={api.previous}>
                <ArrowLeftIcon />
              </IconButton>
            </li>
            <li className="gallery__fullscreen-nav__list-item">
              <IconButton color="gray" size="4" onClick={api.next}>
                <ArrowRightIcon />
              </IconButton>
            </li>
          </ul>
        </nav>

        <IconButton
          className="gallery__fullscreen-image__close-button"
          color="gray"
          size="3"
          onClick={api.close}
        >
          <CloseIcon />
        </IconButton>
      </DialogContentWrapper>
    </>
  );
};
