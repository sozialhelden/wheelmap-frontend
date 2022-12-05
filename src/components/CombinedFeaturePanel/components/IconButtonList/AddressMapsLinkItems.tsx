import Link from "next/link";
import React, { useDebugValue } from "react";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LocaleContext";
import useUserAgent from "../../../../lib/context/UserAgentContext";
import useCategory from "../../../../lib/fetchers/useCategory";
import { generateMapsUrl } from "../../../../lib/model/generateMapsUrls";
import { AnyFeature } from "../../../../lib/model/shared/AnyFeature";
import { generateShowOnOsmUrl } from "../../../../lib/model/shared/generateOsmUrls";
import { placeNameFor } from "../../../../lib/model/shared/placeNameFor";
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
  const languageTags = useCurrentLanguageTagStrings();
  const { category } = useCategory(feature);

  if (!feature || !feature.properties) return null;

  const placeName = React.useMemo(
    () => placeNameFor(feature, category, languageTags),
    [feature, category, languageTags]
  );

  const openInMaps = React.useMemo(
    () => generateMapsUrl(userAgent, feature, placeName),
    [userAgent, feature, placeName]
  );

  const showOnOsmUrl = React.useMemo(() => generateShowOnOsmUrl(feature), [
    feature,
  ]);

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
