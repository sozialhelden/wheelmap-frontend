import { AspectRatio, Card, Inset, VisuallyHidden } from "@radix-ui/themes";
import { type FC, type MouseEventHandler, useContext, useMemo } from "react";
import styled from "styled-components";
import { t } from "ttag";
import { AppStateLink } from "~/components/App/AppStateLink";
import Image from "~/components/Image";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import { GalleryContext } from "./Gallery";

const StyledImage = styled(Image)`
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

export const GalleryGridItem: FC<{
  image: AccessibilityCloudImage;
}> = ({ image }) => {
  const api = useContext(GalleryContext);

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
              <StyledImage image={image} height={210} alt="" />
            </AspectRatio>
          </Inset>
        </AppStateLink>
      </Card>
    </li>
  );
};
