import { Dialog } from "@radix-ui/themes";
import {
  type FC,
  type KeyboardEventHandler,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
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

  const [activeIndex, setActiveIndex] = useState(-1);
  const [dialogOpen, setDialogOpen] = useState(false);

  const activeImage = images[activeIndex];
  const next = () => {
    setActiveIndex(activeIndex + 1 >= images.length ? 0 : activeIndex + 1);
  };
  const previous = () => {
    setActiveIndex(activeIndex - 1 < 0 ? images.length - 1 : activeIndex - 1);
  };
  const goTo = (imageId: string) => {
    setActiveIndex(getImageIndex(imageId));
    setDialogOpen(true);
  };
  const close = () => {
    setDialogOpen(false);
  };
  const getDetailPageUrl = (imageId: string) => {
    return `${baseFeatureUrl}/images/${imageId}`;
  };

  const api: GalleryContextType = {
    activeImage,
    activeIndex,
    size: images.length,
    getDetailPageUrl,
    next,
    goTo,
    close,
    previous,
  };

  // Open the dialog on initial page load when visiting the /images/[imageId] page
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (activeImageId) goTo(activeImageId);
  }, [images, activeImageId]);

  // Reset the url when closing the dialog
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (
      !dialogOpen &&
      activeImage &&
      window.location.pathname !== baseFeatureUrl
    ) {
      router.push(baseFeatureUrl);
    }
  }, [dialogOpen]);

  // Set the url when navigating to an image
  // biome-ignore lint/correctness/useExhaustiveDependencies:
  useEffect(() => {
    if (!dialogOpen || !activeImage) {
      return;
    }
    const url = getDetailPageUrl(activeImage._id);
    if (url !== window.location.pathname) {
      router.push(url, undefined, { shallow: true });
    }
  }, [activeImage]);

  // The Dialog component can autofocus on its own, when using the Dialog.Trigger component.
  // But in this case, we want to focus the currently active image and not the one that actually
  // opened the Dialog in the first place, so that's why this functionality is implemented a
  // second time.
  const galleryRef = useRef<HTMLElement>(null);
  const handleOnCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    galleryRef.current
      ?.querySelector<HTMLAnchorElement>(`[data-image-id=${activeImage?._id}]`)
      ?.focus();
  };

  const handleKeyDown: KeyboardEventHandler<HTMLElement> = (event) => {
    switch (event.key) {
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

  return (
    <GalleryContext.Provider value={api}>
      <Dialog.Root open={dialogOpen} onOpenChange={setDialogOpen}>
        <GalleryGrid ref={galleryRef}>
          {images.map((image) => (
            <GalleryGridItem key={image._id} image={image} />
          ))}
        </GalleryGrid>

        <Dialog.Content
          height="calc(100vh - 8rem)"
          width="calc(100vw - 4rem)"
          maxWidth="none"
          maxHeight="none"
          onCloseAutoFocus={handleOnCloseAutoFocus}
          onKeyDown={handleKeyDown}
        >
          <GalleryFullscreenItem image={activeImage} />
        </Dialog.Content>
      </Dialog.Root>
    </GalleryContext.Provider>
  );
};
