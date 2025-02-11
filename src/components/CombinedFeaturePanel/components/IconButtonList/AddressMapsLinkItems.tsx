import Link from "next/link";
import React from "react";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../../../lib/context/LanguageTagContext";
import useUserAgent from "../../../../lib/context/UserAgentContext";
import useCategory from "../../../../lib/fetchers/ac/refactor-this/useCategory";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import { generateMapsUrl } from "../../../../lib/model/geo/generateMapsUrls";
import { placeNameFor } from "../../../../lib/model/geo/placeNameFor";
import { generateShowOnOsmUrl } from "../../../../lib/model/osm/generateOsmUrls";
import openButtonCaption from "../../../../lib/openButtonCaption";
import PlaceIcon from "../../../icons/actions/Place";
import RouteIcon from "../../../icons/actions/Route";
import FeatureAddressString, {
  addressForFeature,
} from "../FeatureAddressString";
import { CaptionedIconButton } from "./CaptionedIconButton";

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
    [feature, category, languageTags],
  );

  const openInMapsUrl = React.useMemo(
    () => generateMapsUrl(userAgent, feature, placeName),
    [userAgent, feature, placeName],
  );

  const showOnOsmUrl = React.useMemo(
    () => generateShowOnOsmUrl(feature),
    [feature],
  );

  // const address = addressForFeature(feature);
  // const addressElement = address && <FeatureAddressString address={address} />;

  return (
    <>
      {openInMapsUrl && (
        <CaptionedIconButton
          href={openInMapsUrl}
          icon={<RouteIcon />}
          caption={t`Map`}
        />
      )}
      {showOnOsmUrl && (
        <CaptionedIconButton
          href={showOnOsmUrl}
          icon={<PlaceIcon />}
          caption={t`OpenStreetMap`}
        />
      )}
    </>
  );
}
