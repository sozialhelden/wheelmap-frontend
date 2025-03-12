import { useMemo } from "react";
import useSWR from "swr";
import {
  makeImageIds,
  makeImageLocation,
} from "~/components/CombinedFeaturePanel/components/Gallery/util";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import type OSMFeature from "~/lib/model/osm/OSMFeature";
import useAccessibilityCloud from "~/modules/accessibility-cloud/hooks/useAccessibilityCloud";

type Params = {
  feature: OSMFeature;
  shouldFetch?: boolean;
};

interface ImageResponse {
  totalCount: number;
  images: AccessibilityCloudImage[];
}

export const accessibilityCloudImageFetcher = (urls: string[]) => {
  const f = (u) =>
    fetch(u).then((r) => {
      if (r.ok) {
        return r.json() as Promise<ImageResponse>;
      }

      throw new Error("Request failed");
    });
  return Promise.all(urls.flatMap(f));
};

const useAccessibilityCloudImages = ({
  feature,
  shouldFetch = true,
}: Params) => {
  const imageIds = makeImageIds(feature as AnyFeature);
  const { baseUrl, appToken } = useAccessibilityCloud({ cached: true });

  const { data, error, isLoading, mutate } = useSWR(
    baseUrl && appToken && shouldFetch
      ? imageIds.map((x) =>
          makeImageLocation(baseUrl, appToken, x.context, x.id),
        )
      : null,
    accessibilityCloudImageFetcher,
  );

  const acImages = useMemo(() => data?.flatMap((x) => x.images) ?? [], [data]);

  return { acImages, error, isLoading, mutate };
};

export default useAccessibilityCloudImages;
