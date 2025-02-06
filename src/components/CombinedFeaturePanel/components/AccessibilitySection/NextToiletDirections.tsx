import Link from "next/link";
import { t } from "ttag";
import { useNearbyFeatures } from "../../../../lib/fetchers/osm-api/fetchNearbyFeatures";
import { hasAccessibleToilet } from "../../../../lib/model/ac/Feature";
import type { AnyFeature } from "../../../../lib/model/geo/AnyFeature";
import colors from "../../../../lib/util/colors";
import { formatDistance } from "../../../../lib/util/strings/formatDistance";
import { PlaceholderSpan } from "../../../shared/Placeholder";

export default function NextToiletDirections({
  feature,
}: { feature: AnyFeature }) {
  const shouldShowNextToilets = hasAccessibleToilet(feature) !== "yes";
  const {
    response: { isLoading },
    nearbyFeatures,
  } = useNearbyFeatures(shouldShowNextToilets && feature, {
    wheelchair: "yes",
  });
  const caption = t`Next wheelchair-accessible WC`;

  if (isLoading) {
    return (
      <PlaceholderSpan color={colors.linkColor}>
        {caption} 100 m →
      </PlaceholderSpan>
    );
  }
  const nextToilet = nearbyFeatures?.[0];
  if (!nextToilet) {
    return null;
  }

  const distanceInMeters =
    typeof nextToilet.properties.distance === "number"
      ? nextToilet.properties.distance
      : Number.parseFloat(nextToilet.properties.distance);
  const formattedDistance = formatDistance(distanceInMeters);
  const { distance, unit } = formattedDistance;

  const distanceElement = (
    <span className="subtle distance">
      &nbsp;
      {distance}
      &nbsp;
      {unit}
      &nbsp;→
    </span>
  );

  return (
    // TODO this is not a very good solution. In the future, we should take a look
    // at routing and make sure that something like '/amenities/way/1234" also works
    <Link href={`/amenities/${nextToilet.properties._id?.replace("/", ":")}`}>
      {caption}
      {distanceElement}
    </Link>
  );
}
