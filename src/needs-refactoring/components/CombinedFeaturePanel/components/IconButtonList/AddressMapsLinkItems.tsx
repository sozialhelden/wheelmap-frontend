import { MapPinned, Navigation } from "lucide-react";
import Link from "next/link";
import React from "react";
import { useUserAgent } from "~/hooks/useUserAgent";
import type { AnyFeature } from "~/needs-refactoring/lib/model/geo/AnyFeature";
import { generateMapsUrl } from "~/needs-refactoring/lib/model/geo/generateMapsUrls";
import { usePlaceNameFor } from "~/needs-refactoring/lib/model/geo/usePlaceNameFor";
import { generateShowOnOsmUrl } from "~/needs-refactoring/lib/model/osm/generateOsmUrls";
import openButtonCaption from "~/needs-refactoring/lib/openButtonCaption";
import FeatureAddressString, {
  addressForFeature,
} from "../FeatureAddressString";

import { findCategory } from "~/modules/categories/utils/display";

type Props = {
  feature?: AnyFeature;
};

export default function AddressMapsLinkItems(props: Props) {
  const { feature } = props;
  const { userAgent } = useUserAgent();
  const category = findCategory(feature);

  if (!feature || !feature.properties) return null;

  const placeName = usePlaceNameFor(feature, category);

  const openInMaps = React.useMemo(
    () => generateMapsUrl(userAgent, feature, placeName),
    [userAgent, feature, placeName],
  );

  const showOnOsmUrl = React.useMemo(
    () => generateShowOnOsmUrl(feature),
    [feature],
  );

  const address = addressForFeature(feature);
  const addressElement = address && <FeatureAddressString address={address} />;

  return (
    <>
      {openInMaps && (
        <li>
          <Link href={openInMaps.url} target="_blank" rel="noopener noreferrer">
            <Navigation />
            <span>{addressElement || openInMaps.caption}</span>
          </Link>
        </li>
      )}
      {showOnOsmUrl && (
        <li>
          <Link href={showOnOsmUrl} target="_blank" rel="noopener noreferrer">
            <MapPinned />
            <span>{openButtonCaption("OpenStreetMap")}</span>
          </Link>
        </li>
      )}
    </>
  );
}
