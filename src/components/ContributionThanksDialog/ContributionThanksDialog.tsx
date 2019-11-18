import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import colors from '../../lib/colors';
import Toolbar from '../Toolbar';
import ChevronRight from '../icons/actions/ChevronRight';
import CloseLink from '../CloseButton';
import queryString from 'query-string';
import { ChromelessButton, CallToActionLink } from '../Button';
import { trackingEventBackend } from '../../lib/TrackingEventBackend';
import { AppContext } from '../../AppContext';
import { trackEvent } from '../../lib/Analytics';

export type Props = {
  hidden: boolean,
  isExpanded?: boolean,
  onClose: () => void,
  addPlaceUrl: string | null,
  onAddPlaceLinkClick?: () => void,
  appContext: AppContext,
};

const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 20px 5px 20px 5px;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;
  color: ${colors.textColorTonedDown};

  h2, h3 {
    font-weight: 300;
    font-size: 2rem;
    flex: 1;
  }

  > header {
    position: sticky;
    display: flex;
    flex-direction: row;
    align-items: center;
    top: 0;
    height: 50px;
    min-height: 50px;
    z-index: 1;
    padding-left: 1rem;
  }

  > section {
    overflow: auto;
    padding: 0 1rem 10px 1rem;
    display: flex;
    flex-direction: column;

    p {
      margin-bottom: 60px;
    }

    > button {
      margin: 0 1em 0.5em;
    }
  }
`;

export default class ContributionThanksDialog extends React.Component<Props> {
  props: Props;

  componentDidMount() {
    // log event on client
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search);
      const uniqueSurveyId = queryParams.uniqueSurveyId;
      if (uniqueSurveyId && typeof uniqueSurveyId === 'string') {
        trackingEventBackend.track(this.props.appContext.app, {
          type: 'SurveyCompleted',
          uniqueSurveyId: uniqueSurveyId,
        });
        trackEvent({
          category: 'Survey',
          action: 'Completed',
          label: uniqueSurveyId,
        });
      }
    }
  }

  render() {
    const className = ['contribution-thanks-dialog', this.props.isExpanded && 'is-expanded']
      .filter(Boolean)
      .join(' ');

    const header = t`Thank you!`;
    const text = t`Please give us a moment to verify your contribution.`;

    const addNextPlaceButtonCaption = t`Add next place`;
    const backToMapButtonCaption = t`Back to map`;

    return (
      <StyledToolbar className={className} hidden={this.props.hidden} isModal>
        <header>
          <h2>{header}</h2>
          <CloseLink onClick={this.props.onClose} />
        </header>
        <section>
          <p>{text}</p>

          {this.props.addPlaceUrl && (
            <CallToActionLink
              data-focus-visible-added
              href={this.props.addPlaceUrl}
              target="_blank"
              onClick={this.props.onAddPlaceLinkClick}
            >
              {addNextPlaceButtonCaption}
              <ChevronRight />
            </CallToActionLink>
          )}

          <ChromelessButton onClick={this.props.onClose}>{backToMapButtonCaption}</ChromelessButton>
        </section>
      </StyledToolbar>
    );
  }
}
