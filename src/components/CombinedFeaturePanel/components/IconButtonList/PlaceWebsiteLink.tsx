import Link from "next/link";
import styled from "styled-components";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import WorldIcon from "../../../icons/actions/World";

const NonBreakingSpan = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

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

  return (
    <li>
      <Link href={placeWebsiteUrl} target="_blank" rel="noreferrer noopener">
        <WorldIcon />
        <NonBreakingSpan>{placeWebsiteUrl}</NonBreakingSpan>
      </Link>
    </li>
  );
}
