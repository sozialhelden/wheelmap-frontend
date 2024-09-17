import { t } from 'ttag'

import styled from 'styled-components'

import useCategory from '../../lib/fetchers/ac/refactor-this/useCategory'
import { AnyFeature } from '../../lib/model/geo/AnyFeature'
import getAddressString from '../../lib/model/geo/getAddressString'
import colors from '../../lib/util/colors'
import Address from '../NodeToolbar/Address'
import Icon from '../shared/Icon'
import { PlaceNameHeader } from '../shared/PlaceName'
import { AppStateLink } from '../App/AppStateLink'
import { EnrichedSearchResult } from './useEnrichedSearchResults'
import { cx } from '../../lib/util/cx'
import { isWheelchairAccessible } from '../../lib/model/accessibility/isWheelchairAccessible'

type Props = {
  className?: string;
  feature: EnrichedSearchResult;
  hidden: boolean;
}

const StyledListItem = styled.li`
    padding: 0;

    > a {
        display: block;
        font-size: 16px;
        padding: 10px;
        text-decoration: none;
        border-radius: 4px;
        cursor: pointer;
        background-color: transparent;
        border: none;
        outline: none;
        text-align: left;
        overflow: hidden;
        color: rgba(0, 0, 0, 0.8) !important;
        width: 100%;

        @media (hover), (-moz-touch-enabled: 0) {
            &:hover {
                background-color: ${colors.linkBackgroundColorTransparent};
            }
        }

        &:focus&:not(.primary-button) {
            background-color: ${colors.linkBackgroundColorTransparent};
        }

        &:disabled {
            opacity: 0.15;
        }

        &:hover {
            color: rgba(0, 0, 0, 0.8) !important;
        }

        address {
            font-size: 16px !important;
            color: rgba(0, 0, 0, 0.6);
        }
    }

    &.no-result {
        text-align: center;
        font-size: 16px;
        overflow: hidden;
        padding: 20px;
    }

    &.error-result {
        text-align: center;
        font-size: 16px;
        overflow: hidden;
        padding: 20px;
        font-weight: 400;
        background-color: ${colors.negativeBackgroundColorTransparent};
    }

    &.osm-category-place-borough,
    &.osm-category-place-suburb,
    &.osm-category-place-village,
    &.osm-category-place-hamlet,
    &.osm-category-place-town,
    &.osm-category-place-city,
    &.osm-category-place-county,
    &.osm-category-place-state,
    &.osm-category-place-country,
    &.osm-category-boundary-administrative {
        header {
            font-weight: 600;
        }
    }
`

function mapResultToUrlObject(result: EnrichedSearchResult) {
  const { properties, geometry } = result.komootPhotonResult

  if (result.placeInfo) {
    return {
      pathname: `/nodes/${result.placeInfo.properties._id}`,
      query: {
        q: null,
        extent: properties.extent,
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
      },
    }
  }

  if (properties.osm_key === 'place') {
    return {
      query: {
        extent: properties.extent,
        lat: geometry.coordinates[1],
        lon: geometry.coordinates[0],
      },
    }
  }

  const osmType = {
    N: 'node',
    W: 'way',
    R: 'relation',
  }[properties.osm_type || 'N']

  return {
    pathname: `/amenities/${osmType}:${properties.osm_id}`,
    query: {
      q: null,
      extent: properties.extent,
      lat: geometry.coordinates[1],
      lon: geometry.coordinates[0],
    },
  }
}

export default function SearchResult({ feature, className, hidden }: Props) {
  const { properties } = feature.komootPhotonResult

  // translator: Place name shown in search results for places with unknown name / category.
  const placeName = properties ? properties.name : t`Unnamed`
  const address = properties
    && getAddressString({
      countryCode: properties.country,
      street: properties.street,
      house: properties.housenumber,
      postalCode: properties.postcode,
      city: properties.city,
    })

  const { category } = useCategory(
    (feature.placeInfo || feature.osmFeature || feature.komootPhotonResult) as AnyFeature,
  )
  const shownCategoryId = category && category._id

  const detailedFeature = (feature.placeInfo || feature.osmFeature) as AnyFeature | null
  const accessibility = detailedFeature && isWheelchairAccessible(detailedFeature)

  const href = mapResultToUrlObject(feature)

  const classNames = cx(
    className,
    'search-result',
    feature.osmFeature && 'is-on-wheelmap',
    `osm-category-${properties.osm_key || 'unknown'}-${properties.osm_value || 'unknown'}`,
  )
  return (
    <StyledListItem className={classNames}>
      <AppStateLink href={href} tabIndex={hidden ? -1 : 0}>
        <PlaceNameHeader
          className={detailedFeature ? 'is-on-wheelmap' : undefined}
        >
          {shownCategoryId ? (
            <Icon
              accessibility={accessibility || null}
              category={shownCategoryId}
              size="medium"
              centered
              ariaHidden
            />
          ) : null}
          {placeName}
        </PlaceNameHeader>
        {address ? <Address role="none">{address}</Address> : null}
      </AppStateLink>
    </StyledListItem>
  )
}
