import { t } from 'ttag';
import * as React from 'react';
import { accessibilityCloudFeatureFrom, wheelmapFeatureFrom } from '../../../lib/Feature';
import { Feature } from '../../../lib/Feature';
import AppContext, { AppContextConsumer } from '../../../AppContext';
import Link from '../../Link/Link';
import { translatedStringFromObject } from '../../../lib/i18n';
import { isEqual } from 'lodash';
import * as testMongoDBSelector from 'json-criteria';
import { insertPlaceholdersToAddPlaceUrl } from '../../../lib/insertPlaceholdersToAddPlaceUrl';
import { v4 as uuidv4 } from 'uuid';
import { MappingEvent } from '../../../lib/MappingEvent';
import { PenIcon } from '../../icons/actions';
import styled from 'styled-components';
import colors from '../../../lib/colors';

type Props = {
  feature: Feature | null,
  joinedMappingEvent?: MappingEvent,
};

const selectorStringsToSelectors = new Map<string, any>();

function isLinkVisible(
  feature: Feature | null,
  selectorString?: string,
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
    return (testMongoDBSelector.test(feature, selector));
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
  const appContext = React.useContext(AppContext);
  const externalPlaceLinks = appContext.app?.clientSideConfiguration?.externalPlaceLinks;
  const [uniqueSurveyId, setUniqueSurveyId] = React.useState<string>(uuidv4());
  const resetSurveyId = React.useCallback(() => {
    setUniqueSurveyId(uuidv4());
  }, []);

  if (!externalPlaceLinks) return null;

  const links = externalPlaceLinks
    .filter(link => isLinkVisible(props.feature, link.selectorString))
    .map((link, index) => {
      const href = insertPlaceholdersToAddPlaceUrl(
        { url: link.href, uniqueSurveyId, joinedMappingEvent: props.joinedMappingEvent, feature: props.feature },
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
    });

  return <>{links}</>;
}
