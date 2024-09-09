import { t } from 'ttag'
import Link from 'next/link'
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature'
import { useNearbyFeatures } from '../../../../lib/fetchers/osm-api/fetchNearbyFeatures'
import { formatDistance } from '../../../../lib/util/strings/formatDistance'
import { hasAccessibleToilet } from '../../../../lib/model/ac/Feature'
import { PlaceholderSpan } from '../../../shared/Placeholder'
import colors from '../../../../lib/util/colors'

export default function NextToiletDirections({ feature }: { feature: AnyFeature }) {
  const shouldShowNextToilets = hasAccessibleToilet(feature) !== 'yes';
  const { response: { isLoading }, nearbyFeatures } = useNearbyFeatures(shouldShowNextToilets && feature, { wheelchair: 'yes' })
  const caption = t`Next wheelchair-accessible WC`;

  if (isLoading) {
    return <PlaceholderSpan color={colors.linkColor}>{caption} 100 m →</PlaceholderSpan>
  }
  const nextToilet = nearbyFeatures?.[0]
  if (!nextToilet) {
    return null;
  }

  const distanceInMeters = typeof nextToilet.properties.distance === 'number'
    ? nextToilet.properties.distance
    : parseFloat(nextToilet.properties.distance)
  const formattedDistance = formatDistance(distanceInMeters)
  const { distance, unit } = formattedDistance

  const distanceElement = (
    <span className="subtle distance">
    &nbsp;
      {distance}
  &nbsp;
      {unit}
  &nbsp;→
    </span>
  )

  return (
    <Link href={`/${nextToilet.properties._id}`}>
      {caption}
      {distanceElement}
    </Link>
  )
}
