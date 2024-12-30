import { Dialog, VisuallyHidden } from "@radix-ui/themes";
import {
  type FC,
  type KeyboardEventHandler,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { t } from "ttag";
import type { AccessibilityCloudImage } from "../../../../lib/model/ac/Feature";
import { useAppStateAwareRouter } from "../../../../lib/util/useAppStateAwareRouter";
import { FeaturePanelContext } from "../../FeaturePanelContext";
import { GalleryFullscreenItem } from "./GalleryFullscreenItem";
import { GalleryGrid } from "./GalleryGrid";
import { GalleryGridItem } from "./GalleryGridItem";

type GalleryContextType = {
  size: number;
  activeIndex: number;
  activeImage?: AccessibilityCloudImage;
  next: () => void;
  previous: () => void;
  goTo: (imageId: string) => void;
  close: () => void;
  getDetailPageUrl: (imageId: string) => string;
  getReportUrl: (imageId: string) => string;
};
export const GalleryContext = createContext<GalleryContextType>({
  size: 0,
  activeIndex: -1,
  activeImage: undefined,
  next() {},
  previous() {},
  goTo(imageId) {},
  close() {},
  getDetailPageUrl(imageId) {
    return "";
  },
  getReportUrl(imageId) {
    return "";
  },
});

export const Gallery: FC<{
  images: AccessibilityCloudImage[];
  activeImageId?: string;
}> = ({ images, activeImageId }) => {
  const { baseFeatureUrl } = useContext(FeaturePanelContext);
  const router = useAppStateAwareRouter();

  const getImageIndex = (imageId?: string) => {
    if (!imageId) return -1;
    return images.findIndex((image) => image._id === imageId);
  };

  const keysPressed = new Set<string>();
  const [activeIndex, setActiveIndex] = useState(-1);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const activeImage = images[activeIndex];
  const next = () => {
    setActiveIndex(activeIndex + 1 >= images.length ? 0 : activeIndex + 1);
  };
  const previous = () => {
    setActiveIndex(activeIndex - 1 < 0 ? images.length - 1 : activeIndex - 1);
  };
  const goTo = (imageId: string) => {
    setActiveIndex(getImageIndex(imageId));
    setIsDialogOpen(true);
  };
  const close = () => {
    setIsDialogOpen(false);
  };
  const getDetailPageUrl = (imageId: string) => {
    return `${baseFeatureUrl}/images/${imageId}`;
  };
  const getReportUrl = (imageId: string) => {
    return `${getDetailPageUrl(imageId)}/report`;
  };

  const api: GalleryContextType = {
    activeImage,
    activeIndex,
    size: images.length,
    next,
    goTo,
    close,
    previous,
    getDetailPageUrl,
    getReportUrl,
  };

  // Open the dialog on initial page load when visiting the /images/[imageId] page
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (activeImageId) goTo(activeImageId);
  }, [images, activeImageId]);

  // Reset the url when closing the dialog. This is not using react router on purpose.
  // When using react-router it will re-render the whole FeaturePanel, because it's a
  // new page. This introduces lag, and we want the dialog to open immediately after
  // clicking on the image. This is temporary, the proper solution should be to use
  // a catch-all router in the `[placeType]/[id]/index.tsx` and handle different
  // nested-routes like image upload or fullscreen image there, without re-rendering
  // the whole FeaturePanel.
  // TODO: replace with catch-all route
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (
      !isDialogOpen &&
      activeImage &&
      window.location.pathname !== baseFeatureUrl
    ) {
      window.history.replaceState(null, document.title, baseFeatureUrl);
    }
  }, [isDialogOpen]);

  // Set the url when navigating to an image
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!isDialogOpen || !activeImage) {
      return;
    }
    const url = getDetailPageUrl(activeImage._id);
    if (url !== window.location.pathname) {
      window.history.replaceState(null, document.title, url);
    }
  }, [isDialogOpen, activeImage]);

  // The Dialog component can autofocus on its own, when using the Dialog.Trigger component.
  // But in this case, we want to focus the currently active image and not the one that actually
  // opened the Dialog in the first place, so that's why this functionality is implemented a
  // second time.
  const handleOnCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    document
      .querySelector<HTMLAnchorElement>(`[data-image-id="${activeImage?._id}"]`)
      ?.focus();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    keysPressed.add(event.key);
    switch (event.key) {
      case "r":
        if (keysPressed.size === 1) {
          router.push(getReportUrl(activeImage._id));
        }
        break;
      case "ArrowLeft":
        previous();
        break;
      case "ArrowRight":
        next();
        break;
      default:
        break;
    }
  };
  const handleKeyUp: KeyboardEventHandler<HTMLElement> = (event) => {
    keysPressed.delete(event.key);
  };

  return (
    <GalleryContext.Provider value={api}>
      <Dialog.Root open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <GalleryGrid>
          {images.map((image) => (
            <GalleryGridItem key={image._id} image={image} />
          ))}
        </GalleryGrid>

        <Dialog.Content
          maxWidth="none"
          maxHeight="none"
          onCloseAutoFocus={handleOnCloseAutoFocus}
          onKeyDown={handleKeyDown}
          onKeyUp={handleKeyUp}
        >
          <VisuallyHidden asChild aria-hidden>
            <Dialog.Title>{t`Image gallery.`}</Dialog.Title>
          </VisuallyHidden>
          <VisuallyHidden asChild aria-hidden>
            <Dialog.Description>
              {t`Use the left and right arrow keys to navigate between images, press the r key to report an image and the escape key to close it.`}
            </Dialog.Description>
          </VisuallyHidden>
          <GalleryFullscreenItem image={activeImage} />
        </Dialog.Content>
      </Dialog.Root>
    </GalleryContext.Provider>
  );
};
