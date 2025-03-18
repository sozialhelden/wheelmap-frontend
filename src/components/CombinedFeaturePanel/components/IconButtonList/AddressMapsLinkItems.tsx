import Link from "next/link";
import React from "react";
import useCategory from "../../../../domains/categories/hooks/useCategory";
import useUserAgent from "../../../../lib/context/UserAgentContext";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import { generateMapsUrl } from "../../../../lib/model/geo/generateMapsUrls";
import { usePlaceNameFor } from "../../../../lib/model/geo/usePlaceNameFor";
import { generateShowOnOsmUrl } from "../../../../lib/model/osm/generateOsmUrls";
import openButtonCaption from "../../../../lib/openButtonCaption";
import PlaceIcon from "../../../icons/actions/Place";
import RouteIcon from "../../../icons/actions/Route";
import FeatureAddressString, {
  addressForFeature,
} from "../FeatureAddressString";

type Props = {
  feature?: AnyFeature;
};

export default function AddressMapsLinkItems(props: Props) {
  const { feature } = props;
  const userAgent = useUserAgent();
  const { category } = useCategory(feature);

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
            <RouteIcon />
            <span>{addressElement || openInMaps.caption}</span>
          </Link>
        </li>
      )}
      {showOnOsmUrl && (
        <li>
          <Link href={showOnOsmUrl} target="_blank" rel="noopener noreferrer">
            <PlaceIcon />
            <span>{openButtonCaption("OpenStreetMap")}</span>
          </Link>
        </li>
      )}
    </>
  );
}
