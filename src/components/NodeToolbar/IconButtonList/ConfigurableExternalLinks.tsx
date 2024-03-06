import * as testMongoDBSelector from 'json-criteria';
import { isEqual } from 'lodash';
import * as React from 'react';
import styled from 'styled-components';
import useSWR from 'swr';
import { v4 as uuidv4 } from 'uuid';
import AppContext from '../../../AppContext';
import { fetchAccessibilityCloudPlacesBySameURI } from '../../../app/fetchAccessibilityCloudPlacesBySameURI';
import { Feature, accessibilityCloudFeatureFrom, wheelmapFeatureFrom } from '../../../lib/Feature';
import { MappingEvent } from '../../../lib/MappingEvent';
import colors from '../../../lib/colors';
import { translatedStringFromObject } from '../../../lib/i18n';
import { insertPlaceholdersToAddPlaceUrl } from '../../../lib/insertPlaceholdersToAddPlaceUrl';
import Link from '../../Link/Link';
import { PenIcon } from '../../icons/actions';

type Props = {
  feature: Feature | null,
  joinedMappingEvent?: MappingEvent,
};

const selectorStringsToSelectors = new Map<string, any>();

function isLinkVisible(
  { sameFeatures, feature, selectorString }: { sameFeatures: Feature[], feature: Feature | null; selectorString?: string; },
): boolean {
  if (!feature) {
    return false;
  }
  const acFeature = accessibilityCloudFeatureFrom(feature);
  const osmFeature = wheelmapFeatureFrom(feature);
  if (!acFeature && !osmFeature) return null;
  if (isEqual(selectorString, {})) {
    return true;
  }
  let selector = selectorStringsToSelectors.get(selectorString);
  try {
    if (!selector) {
      selector = JSON.parse(selectorString);
      selectorStringsToSelectors.set(selectorString, selector);
    }
    return (testMongoDBSelector.test({ feature, sameFeatures }, selector));
  } catch (error) {
    console.error('Error parsing / using selector to match place:', feature, selector, error);
  }
}

const StyledLink = styled(Link)`
  margin: -0.5rem -1rem;
  padding: 0.5rem 1rem;
  display: flex;
  flex-direction: row;
  align-items: center;

  &:hover {
    background-color: ${colors.linkBackgroundColorTransparent};
  }
`;

const StyledPenIcon = styled(PenIcon)`
  margin: 0.25rem 0.6rem;
  path {
    fill: ${colors.linkColor};
  }
`;

export default function ConfigurableExternalLinks(props: Props): JSX.Element {
  const { feature, joinedMappingEvent } = props;
  const appContext = React.useContext(AppContext);
  const externalPlaceLinks = appContext.app?.clientSideConfiguration?.externalPlaceLinks;
  const [uniqueSurveyId, setUniqueSurveyId] = React.useState<string>(uuidv4());
  const resetSurveyId = React.useCallback(() => {
    setUniqueSurveyId(uuidv4());
  }, []);

  const wheelmapFeature = wheelmapFeatureFrom(feature);
  const osmUri = wheelmapFeature && `https://openstreetmap.org/${wheelmapFeature.properties.osm_type}/${wheelmapFeature.properties.id}`;
  const osmUris = React.useMemo(() => [osmUri], [osmUri]);
  const { data: sameFeaturesByUri } = useSWR(wheelmapFeature && [appContext.app.tokenString, osmUris], fetchAccessibilityCloudPlacesBySameURI);
  const sameFeatures = React.useMemo(() => sameFeaturesByUri?.[osmUri] || [], [sameFeaturesByUri, osmUri]);

  const links = React.useMemo(
    () => externalPlaceLinks?.filter(
      link => isLinkVisible({ sameFeatures, feature, selectorString: link.selectorString })
    )
      .map((link) => {
        const href = insertPlaceholdersToAddPlaceUrl(
          { url: link.href, uniqueSurveyId, joinedMappingEvent, feature },
        );

        return (
          <StyledLink
            key={link.href}
            to={href}
            onClick={resetSurveyId}
            style={{ fontWeight: 'bolder' }}
          >
            <StyledPenIcon />
            &nbsp;
            {translatedStringFromObject(link.caption)}
          </StyledLink>
        );
      }),
    [externalPlaceLinks, sameFeatures, feature, uniqueSurveyId, joinedMappingEvent, resetSurveyId],
  );

  if (!links) return null;

  return <>{links}</>;
}
