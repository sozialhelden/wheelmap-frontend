import React from "react";
import { t } from "ttag";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import WorldIcon from "../../../icons/actions/World";
import { CaptionedIconButton } from "./CaptionedIconButton";

type Props = {
  feature: AnyFeature;
};

export default function PlaceWebsiteLink({ feature }: Props) {
  let placeWebsiteUrl: string | null | undefined;
  if (feature["@type"] === "osm:Feature") {
    placeWebsiteUrl = (feature.properties["contact:website"] ||
      feature.properties.website) as string | undefined;
  } else if (
    feature["@type"] === "a11yjson:PlaceInfo" ||
    feature["@type"] === "ac:PlaceInfo"
  ) {
    placeWebsiteUrl = feature.properties.placeWebsiteUrl;
  }

  if (!placeWebsiteUrl) {
    return null;
  }

  if (typeof placeWebsiteUrl !== "string") {
    return null;
  }

  if (!placeWebsiteUrl.match(/^https?:\/\//i)) {
    return null;
  }

  const hostname = React.useMemo(
    () => new URL(placeWebsiteUrl).hostname.replace(/^www\./, ""),
    [placeWebsiteUrl],
  );

  const caption = hostname.length > 20 ? t`Web` : hostname;

  return (
    <CaptionedIconButton
      href={placeWebsiteUrl}
      icon={<WorldIcon />}
      caption={caption}
    />
  );
}
