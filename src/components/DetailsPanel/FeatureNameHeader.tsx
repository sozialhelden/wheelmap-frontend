import intersperse from 'intersperse';
import { compact, uniq } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import { t } from 'ttag';
import colors from '../../lib/colors';
import { useCurrentAppToken } from '../../lib/context/AppContext';
import { useCurrentLanguageTagStrings } from '../../lib/context/LocaleContext';
import { useCategorySynonymCache } from '../../lib/fetchers/fetchAccessibilityCloudCategories';
import { usePlaceInfo } from '../../lib/fetchers/fetchOnePlaceInfo';
import { getLocalizedStringTranslationWithMultipleLocales } from '../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales';
import {
  getCategoryForFeature, getLocalizableCategoryName
} from '../../lib/model/ac/categories/Categories';
import getFeatureCategoryDisplayName from '../../lib/model/osm/getFeatureCategoryDisplayName';
import { AnyFeature } from '../../lib/model/shared/AnyFeature';
import { isWheelchairAccessible } from "../../lib/model/shared/isWheelchairAccessible";
import { placeNameFor } from "../../lib/model/shared/placeNameFor";
import getEquipmentInfoDescription from '../NodeToolbar/Equipment/getEquipmentInfoDescription';
import { StyledNodeHeader } from '../NodeToolbar/NodeHeader';
import ChevronRight from '../shared/ChevronRight';
import Icon from '../shared/Icon';
import { PlaceNameH1 } from '../shared/PlaceName';

const StyledChevronRight = styled(ChevronRight)`
  vertical-align: -.1rem;
  height: .9rem;
`;

const PlaceNameDetail = styled.div`
  margin-top: 0.5rem;
  color: ${colors.textMuted};
  font-size: 1rem;
`;

function getRoomNumberString(roomNumber: string) {
  return t`Room ${roomNumber}`;
}

type Props = {
  feature: AnyFeature,
  onClickCurrentMarkerIcon?: (feature: AnyFeature) => void,
  children?: React.ReactNode,
};

const StyledHeader = styled.header`
  /**
    This is necessary to make the sticky header get a shadow that extends from the whole panel's
    margin.
  */
  margin: -8px -16px 8px -16px;
  padding: 8px 16px;
  display: flex;
  align-items: flex-start;
  position: sticky;
  top: 0;
  z-index: 1;
  color: rgba(0, 0, 0, 0.8);
  background-color: ${colors.colorizedBackgroundColor};

  ${PlaceNameH1} {
    flex-grow: 2;
  }
`;

export default function FeatureNameHeader(props: Props) {
  const { feature, children } = props;
  const appToken = useCurrentAppToken();
  const categorySynonymCache = useCategorySynonymCache(appToken);
  const category = React.useMemo(() => categorySynonymCache.data && feature && getCategoryForFeature(categorySynonymCache.data, feature), []);
  const acParentPlaceInfoId = feature['@type'] === 'a11yjson:PlaceInfo' ? feature.properties.parentPlaceInfoId : (feature['@type'] === 'a11yjson:EquipmentInfo' ? feature.properties.placeInfoId : undefined);
  const parentPlaceInfo = usePlaceInfo(appToken, acParentPlaceInfoId);
  const parentPlaceInfoCategory = React.useMemo(() => categorySynonymCache.data && parentPlaceInfo.data && getCategoryForFeature(categorySynonymCache.data, parentPlaceInfo.data), [categorySynonymCache.data, parentPlaceInfo]);

  const onClickCurrentMarkerIcon = React.useCallback(() => {
    if (feature && props.onClickCurrentMarkerIcon) {
      props.onClickCurrentMarkerIcon(feature);
    }
  }, [feature]);

  const languageTags = useCurrentLanguageTagStrings();

  if (!feature) return null;
  const properties = feature.properties;
  if (!properties) return null;

  const acFeature = feature['@type'] === 'a11yjson:PlaceInfo' ? feature : null;
  const parentPlaceName = parentPlaceInfo.data && placeNameFor(parentPlaceInfo.data, parentPlaceInfoCategory, languageTags);
    acFeature && getLocalizedStringTranslationWithMultipleLocales(acFeature.properties.parentPlaceInfoName, languageTags);
  const address = acFeature?.properties.address;
  const addressObject = typeof address === 'object' ? address : undefined;
  const levelName = addressObject && getLocalizedStringTranslationWithMultipleLocales(addressObject?.levelName, languageTags);
  const roomNumber = addressObject && getLocalizedStringTranslationWithMultipleLocales(addressObject?.roomNumber, languageTags);
  const roomName = addressObject && getLocalizedStringTranslationWithMultipleLocales(addressObject?.room, languageTags);
  const localizableCategoryName = getLocalizableCategoryName(category);
  let categoryName = localizableCategoryName && getLocalizedStringTranslationWithMultipleLocales(localizableCategoryName, languageTags);
  if (!category && feature['@type'] === 'osm:Feature') {
    categoryName = getFeatureCategoryDisplayName(feature);
  }

  let placeName: string | undefined;
  let ariaLabel = compact([placeName, categoryName]).join(', ');

  if (feature['@type'] === 'a11yjson:EquipmentInfo') {
    placeName =
    getEquipmentInfoDescription(feature, 'shortDescription') ||
    t`Unnamed facility`;
    ariaLabel = getEquipmentInfoDescription(feature, 'longDescription');
  } else if (feature['@type'] === 'a11yjson:PlaceInfo') {
    placeName = placeNameFor(feature, category, languageTags) || roomName;
  } else if (feature['@type'] === 'osm:Feature') {
    placeName = placeNameFor(feature, category, languageTags);
  } else {
    placeName = t`Unknown feature`;
  }

  const roomNumberString = roomNumber !== roomName && roomNumber !== placeName && roomNumber && getRoomNumberString(roomNumber) || undefined;
  const roomNameAndNumber = placeName === roomName ? roomNumberString : [roomName, roomNumberString && `(${roomNumberString})`].join(' ');
  const hasLongName = placeName && placeName.length > 50;
  const icon = (
    <Icon
      accessibility={isWheelchairAccessible(feature)}
      category={category ? category._id : 'undefined'}
      size="medium"
      ariaHidden={true}
      centered
      onClick={onClickCurrentMarkerIcon}
    />
  );

  const nameElements = uniq(compact([parentPlaceName, levelName, roomNameAndNumber, placeName]));
  const lastNameElement = nameElements[nameElements.length - 1];
  const parentElements = intersperse(
    nameElements.slice(0, nameElements.length - 1),
    <StyledChevronRight />
  );

  const placeNameElement = (
    <PlaceNameH1 isSmall={hasLongName} aria-label={ariaLabel}>
      {icon}
      <div>
        <div>{lastNameElement}</div>
        <div>{categoryName}</div>
        <PlaceNameDetail>{parentElements}</PlaceNameDetail>
      </div>
    </PlaceNameH1>
  );

  return (
    <StyledHeader>
      {placeNameElement}
      {children}
    </StyledHeader>
  );
}
