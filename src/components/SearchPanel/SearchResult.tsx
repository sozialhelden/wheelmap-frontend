import { t } from 'ttag'

import styled from 'styled-components'

import React, { useCallback } from 'react'
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
import { useAppStateAwareRouter } from '../../lib/util/useAppStateAwareRouter'
import { useMap } from '../MapNew/useMap'
import { mapOsmCollection, mapOsmType } from './komootHelpers'
import { useCurrentLanguageTagStrings } from '../../lib/context/LanguageTagContext'
import { ACCategory } from '../../lib/model/ac/categories/ACCategory'
import { getLocalizedCategoryName, unknownCategory } from '../../lib/model/ac/categories/Categories'
import { calculateDefaultPadding } from '../MapNew/MapOverlapPadding'

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
  const { properties } = result.komootPhotonResult

  if (result.placeInfo) {
    return {
      pathname: `/nodes/${result.placeInfo.properties._id}`,
      query: {
        q: null,
        extent: result.komootPhotonResult.properties.extent,
        lat: result.komootPhotonResult.geometry.coordinates[1],
        lon: result.komootPhotonResult.geometry.coordinates[0],
      },
    }
  }

  // no osm place was resolved
  if (!result.featureId) {
    return {
      pathname: '/',
      query: {
        q: null,
      },
    }
  }

  const osmType = mapOsmType(result.komootPhotonResult)
  const collection = mapOsmCollection(result.komootPhotonResult)

  return {
    pathname: `/${collection}/${osmType}:${properties.osm_id}`,
    query: {
      q: null,
      extent: result.komootPhotonResult.properties.extent,
      lat: result.komootPhotonResult.geometry.coordinates[1],
      lon: result.komootPhotonResult.geometry.coordinates[0],
    },
  }
}

const useFeatureCategoryLabel = (placeName: string, category: ACCategory | null | undefined) => {
  const languageTags = useCurrentLanguageTagStrings()

  if (!category || category === unknownCategory) {
    return undefined
  }

  const categoryLabel = getLocalizedCategoryName(category, languageTags)

  if (!categoryLabel) {
    return undefined
  }

  const isCategoryLabelInPlaceName = placeName.toLocaleLowerCase(languageTags).includes(categoryLabel.toLocaleLowerCase(languageTags))

  if (isCategoryLabelInPlaceName) {
    return undefined
  }

  return categoryLabel
}

export default function SearchResult({ feature, className, hidden }: Props) {
  const { properties } = feature.komootPhotonResult

  // translator: Place name shown in search results for places with unknown name / category.
  const placeName = properties ? properties.name || t`Unnamed` : t`Unnamed`
  const address = properties
    && getAddressString({
      countryCode: properties.country,
      street: properties.street,
      house: properties.housenumber,
      postalCode: properties.postcode,
      city: properties.city,
    })

  const { category } = useCategory(feature.placeInfo, feature.osmFeature, feature.komootPhotonResult)

  const categoryLabel = useFeatureCategoryLabel(placeName, category)
  const shownCategoryId = category && category._id

  const detailedFeature = (feature.placeInfo || feature.osmFeature) as AnyFeature | null
  const accessibility = detailedFeature && isWheelchairAccessible(detailedFeature)

  const { push } = useAppStateAwareRouter()
  const { map } = useMap()
  const clickHandler = useCallback((evt: React.MouseEvent) => {
    if (evt.ctrlKey) {
      return
    }
    evt.preventDefault()

    const { geometry, properties: { extent } } = feature.komootPhotonResult
    const urlObject = mapResultToUrlObject(feature)

    if (extent) {
      map?.fitBounds(
        [
          [extent[0], extent[1]],
          [extent[2], extent[3]],
        ],
        {
          padding: calculateDefaultPadding(),
        },
      )
    } else {
      map?.flyTo({
        center: [geometry.coordinates[0], geometry.coordinates[1]],
        zoom: 20,
        padding: calculateDefaultPadding(),
      })
    }

    if (urlObject && urlObject.pathname) {
      push(urlObject)
    }
  }, [push, feature, map])

  const classNames = cx(
    className,
    'search-result',
    hidden && 'hidden',
    feature.osmFeature && 'is-on-wheelmap',
    `osm-category-${properties.osm_key || 'unknown'}-${properties.osm_value || 'unknown'}`,
  )
  return (
    <StyledListItem className={classNames}>
      <AppStateLink href={mapResultToUrlObject(feature)} onClick={clickHandler}>
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
          {categoryLabel && <span className="category-label">{categoryLabel}</span>}
        </PlaceNameHeader>
        {address ? <Address role="none">{address}</Address> : null}
      </AppStateLink>
    </StyledListItem>
  )
}
