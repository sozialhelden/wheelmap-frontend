import type { FC } from "react";
import useAccessibilityCloudImages from "~/lib/fetchers/ac/useAccessibilityCloudImages";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import { Gallery } from "./Gallery/Gallery";

export const FeatureGallery: FC<{
  feature: AnyFeature;
  activeImageId?: string;
}> = ({ feature, activeImageId }) => {
  const { acImages: images, mutate } = useAccessibilityCloudImages({
    feature: feature,
  });

  return (
    <>
      <Gallery
        images={images}
        activeImageId={activeImageId}
        onReloadRequested={mutate}
      />
    </>
  );
};
