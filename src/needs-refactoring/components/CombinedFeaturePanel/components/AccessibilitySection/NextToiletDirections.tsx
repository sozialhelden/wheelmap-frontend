import { t } from "@transifex/native";
import Link from "next/link";
import { useFormatDistance } from "~/needs-refactoring/lib/util/strings/useFormatDistance";
import { SecondaryButton } from "~/components/button/SecondaryButton";
import { PlaceholderSpan } from "~/needs-refactoring/components/shared/Placeholder";
import type { NextToilet } from "~/modules/feature-panel/hooks/useNextToilet";

interface Props {
  nextToilet?: NextToilet;
  isLoading?: boolean;
}

const NextToiletDirections = ({ nextToilet, isLoading }: Props) => {
  const caption = t("Next wheelchair-accessible WC");
  if (isLoading) {
    return <PlaceholderSpan>{caption} 100 m →</PlaceholderSpan>;
  }

  if (!nextToilet) {
    return null;
  }

  const distanceInMeters =
    typeof nextToilet?.properties?.distance === "number"
      ? nextToilet?.properties?.distance
      : Number.parseFloat(nextToilet?.properties?.distance);
  const formattedDistance = useFormatDistance(distanceInMeters);
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
    <SecondaryButton size="2" asChild>
      <Link
        href={`/amenities/${nextToilet?.properties?._id?.replace("/", ":")}`}
      >
        {caption}
        {distanceElement}
      </Link>
    </SecondaryButton>
  );
};

export default NextToiletDirections;
