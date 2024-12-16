import { AspectRatio, Card, Inset, VisuallyHidden } from "@radix-ui/themes";
import { type FC, type MouseEventHandler, useContext, useMemo } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import useAccessibilityCloudAPI from "~/lib/fetchers/ac/useAccessibilityCloudAPI";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import { GalleryContext } from "./Gallery";
import { makeSrcSet, makeSrcSetLocation, thumbnailSizes } from "./util";

const Image = styled.img`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const GalleryGridItem: FC<{
  image: AccessibilityCloudImage;
}> = ({ image }) => {
  const { baseUrl } = useAccessibilityCloudAPI({ cached: true });
  const api = useContext(GalleryContext);

  const srcSet = useMemo(() => {
    if (!baseUrl) {
      return undefined;
    }
    return makeSrcSetLocation(makeSrcSet(baseUrl, thumbnailSizes, image));
  }, [baseUrl, image]);

  // biome-ignore lint/correctness/useExhaustiveDependencies:
  const href = useMemo(() => api.getDetailPageUrl(image._id), [image]);

  const onClickHandler: MouseEventHandler<HTMLAnchorElement> = (event) => {
    event.preventDefault();
    api.goTo(image._id);
  };

  return (
    <li>
      <Card asChild>
        <AppStateLink
          href={href}
          onClick={onClickHandler}
          data-image-id={image._id}
        >
          <VisuallyHidden>{t`Open image`}</VisuallyHidden>
          <Inset asChild aria-hidden>
            <AspectRatio ratio={2 / 3}>
              <Image className="gallery__image" srcSet={srcSet} alt="" />
            </AspectRatio>
          </Inset>
        </AppStateLink>
      </Card>
    </li>
  );
};
