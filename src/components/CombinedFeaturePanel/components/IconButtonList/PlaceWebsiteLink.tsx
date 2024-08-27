import Link from 'next/link';
import styled from 'styled-components';
import { AnyFeature } from '../../../../lib/model/geo/AnyFeature';
import WorldIcon from '../../../icons/actions/World';

const NonBreakingSpan = styled.span`
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;

type Props = {
  feature: AnyFeature | null;
};

export default function PlaceWebsiteLink(props: Props) {
  const { feature } = props;

  let placeWebsiteUrl = null;
  if (feature['@type'] === 'osm:Feature') {
    placeWebsiteUrl = feature.properties['contact:website'] || feature.properties.website;
  } else if (feature['@type'] === 'a11yjson:PlaceInfo') {
    placeWebsiteUrl = feature.properties.placeWebsiteUrl;
  }

  if (!placeWebsiteUrl) return null;
  if (!placeWebsiteUrl.match(/^https?:\/\//i)) {
    return null;
  }

  return (
    typeof placeWebsiteUrl === 'string' && (
      <li>
        <Link href={placeWebsiteUrl} target="_blank" rel="noreferrer noopener">
          <WorldIcon />
          <NonBreakingSpan>{placeWebsiteUrl}</NonBreakingSpan>
        </Link>
      </li>
    )
  );
}
