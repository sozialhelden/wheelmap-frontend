import { type FC, useMemo } from "react";
import useSWR from "swr";
import useAccessibilityCloudApi from "~/hooks/useAccessibilityCloudApi";
import type { AccessibilityCloudImage } from "~/needs-refactoring/lib/model/ac/Feature";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { Gallery } from "./Gallery/Gallery";
import { makeImageIds, makeImageLocation } from "./Gallery/util";

const fetcher = (urls: string[]) => {
  const f = (u) =>
    fetch(u).then((r) => {
      if (r.ok) {
        return r.json() as Promise<ImageResponse>;
      }

      throw new Error("Request failed");
    });
  return Promise.all(urls.flatMap(f));
};

interface ImageResponse {
  totalCount: number;
  images: AccessibilityCloudImage[];
}

export const FeatureGallery: FC<{
  feature: AnyFeature;
  activeImageId?: string;
}> = ({ feature, activeImageId }) => {
  const ids = makeImageIds(feature);
  const { baseUrl, appToken } = useAccessibilityCloudApi({ cached: true });
  const { data, mutate } = useSWR(
    baseUrl && appToken
      ? ids.map((x) => makeImageLocation(baseUrl, appToken, x.context, x.id))
      : null,
    fetcher,
  );
  const images = useMemo(() => data?.flatMap((x) => x.images) ?? [], [data]);

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
