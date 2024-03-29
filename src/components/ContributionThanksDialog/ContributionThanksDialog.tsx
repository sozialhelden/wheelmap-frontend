import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import colors from '../../lib/colors';
import Toolbar from '../Toolbar';
import CloseLink from '../CloseButton';
import * as queryString from 'query-string';
import { AppContextData } from '../../AppContext';
import { ChromelessButton, PrimaryButton } from '../Button';
import { trackingEventBackend } from '../../lib/TrackingEventBackend';
import { trackEventExternally } from '../../lib/Analytics';

export type Props = {
  className?: string;
  featureId?: string;
  hidden: boolean;
  isExpanded?: boolean;
  onClose: () => void;
  onSelectFeature: (featureId: string) => void;
  appContext: AppContextData;
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

  > div {
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

      > button, > a {
        margin-bottom: 12px;
      }
    }
  }
`;

export default class ContributionThanksDialog extends React.PureComponent<Props> {
  props: Props;

  componentDidMount() {
    // log event on client
    if (typeof window !== 'undefined') {
      const queryParams = queryString.parse(window.location.search);
      const uniqueSurveyId = queryParams.uniqueSurveyId;
      if (uniqueSurveyId && typeof uniqueSurveyId === 'string') {
        trackingEventBackend.track(this.props.appContext.app, {
          type: 'ThanksDialogShown',
          uniqueSurveyId: uniqueSurveyId,
        });
        trackEventExternally({
          category: 'Survey',
          action: 'ThanksDialogShown',
          label: uniqueSurveyId,
        });
      }
    }
  }

  render() {
    const featureId = this.props.featureId;
    const className = [
      this.props.className,
      'contribution-thanks-dialog',
      this.props.isExpanded && 'is-expanded',
    ]
      .filter(Boolean)
      .join(' ');

    const header = t`Thank you!`;
    const text = t`Your change is saved. It can take a while until it appears on the map.`;

    const backToPlaceButtonCaption = t`Back to place`;
    const backToMapButtonCaption = t`Back to map`;

    return (
      <StyledToolbar className={className} hidden={this.props.hidden} isModal={true}>
        <header>
          <h2>{header}</h2>
          <CloseLink onClick={this.props.onClose} />
        </header>
        <section>
          <span role="img" aria-label={t`Clapping hands`}>
            👏🏽
          </span>
          <p>{text}</p>
          {featureId && (
            <PrimaryButton onClick={() => this.props.onSelectFeature(featureId)}>
              {backToPlaceButtonCaption}
            </PrimaryButton>
          )}
          <ChromelessButton onClick={this.props.onClose}>{backToMapButtonCaption}</ChromelessButton>
        </section>
      </StyledToolbar>
    );
  }
}
