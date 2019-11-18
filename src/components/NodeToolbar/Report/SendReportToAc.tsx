import * as React from 'react';
import { t } from 'ttag';
import styled from 'styled-components';
import { Dots } from 'react-activity';

import strings from './strings';
import colors from '../../../lib/colors';
import { accessibilityCloudFeatureCache } from '../../../lib/cache/AccessibilityCloudFeatureCache';

type ReportReasons =
  | 'invalid-place'
  | 'wrong-location'
  | 'wrong-accessibility-data'
  | 'information-missing'
  | 'permanently-closed';

type Props = {
  reportReason: ReportReasons,
  featureId: string,
  onClose: (event: React.MouseEvent<HTMLButtonElement>) => void,
  className?: string,
  appToken: string,
};

type State = {
  isSuccess: boolean,
  isLoading: boolean,
  error: Error | null,
  request: Promise<boolean> | null,
  lastFeatureId: string | null,
};

export const reportStrings = () => {
  return {
    // translator: Shown as issue description in the report dialog for wrong/missing information
    'information-missing': t`I have more information about this place.`,
    // translator: Shown as issue description in the report dialog for wrong location
    'wrong-accessibility-data': t`The accessibility of the place is marked incorrectly.`,
    // translator: Shown as issue description in the report dialog for wrong location
    'wrong-location': t`The place is at the wrong location.`,
    // translator: Shown as issue description in the report dialog for permanently closed
    'permanently-closed': t`The place is permanently closed.`,
    // translator: Shown as issue description in the report dialog for invalid place
    'invalid-place': t`The place does not exist.`,
  };
};

class SendReportToAc extends React.Component<Props, State> {
  textarea = React.createRef<HTMLTextAreaElement>();

  state = {
    isSuccess: false,
    error: null,
    isLoading: false,
    request: null,
    lastFeatureId: null,
  };

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
    const { featureId } = props;
    const { lastFeatureId } = state;

    // Do not update anything when the same props
    if (featureId === lastFeatureId) {
      return null;
    }

    return {
      lastFeatureId: featureId,
      isSuccess: false,
      isLoading: false,
      error: null,
      request: null,
    };
  }

  componentDidMount() {
    this.awaitResponse();
  }

  componentWillUnmount() {
    delete this.state.request;
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const prevFeatureId = prevProps.featureId;

    if (prevFeatureId !== this.props.featureId) {
      this.awaitResponse();
    }
  }

  startRequest() {
    const { featureId, reportReason, appToken } = this.props;
    const reportMessage = this.textarea.current ? this.textarea.current.value : '';

    this.setState(
      {
        isLoading: true,
        request: accessibilityCloudFeatureCache.reportPlace(
          featureId,
          reportReason,
          reportMessage,
          appToken
        ),
      },
      () => this.awaitResponse()
    );
  }

  awaitResponse() {
    const { request } = this.state;
    if (request) {
      request
        .then(() => {
          if (this.state.request === request) this.setState({ isLoading: false, isSuccess: true });
        })
        .catch(error => {
          console.error(error);
          if (this.state.request === request) this.setState({ isLoading: false, error });
        });
    }
  }

  render() {
    const { className, reportReason } = this.props;
    const { isLoading, error, isSuccess } = this.state;
    const { backButtonCaption } = strings();

    const sendCaption = t`Send`;
    const thankYouCaption = t`Thank you! The place was reported successfully. We will take a look at your report as soon as possible.`;
    const errorCaption = t`Something went wrong reporting the place. Please try again later.`;

    const header = reportStrings()[reportReason];

    const showForm = !(isLoading || error || isSuccess);

    return (
      <section className={className}>
        <header>{header}</header>
        {showForm && (
          <>
            <textarea
              disabled={!showForm}
              placeholder={t`Feel free to add some additional information…`}
              ref={this.textarea}
            />
            <button
              disabled={!showForm}
              className="link-button primary-button"
              onClick={() => this.startRequest()}
            >
              {sendCaption}
            </button>
          </>
        )}
        {isLoading && (
          <p>
            <Dots size={20} />
          </p>
        )}
        {!isLoading && isSuccess && <p className="subtle">{thankYouCaption}</p>}
        {!isLoading && error && <div className="error-result">{errorCaption}</div>}
        <button className="link-button negative-button" onClick={this.props.onClose}>
          {backButtonCaption}
        </button>
      </section>
    );
  }
}

const StyledSendReportToAc = styled(SendReportToAc)`
  display: flex;
  flex-direction: column;

  header,
  button.primary-button,
  textarea {
    margin-top: 0.5em;
    margin-bottom: 0.5em;
  }

  header {
    font-weight: 400;
  }

  .primary-button {
    align-self: flex-end;
    margin-right: 0;
  }

  .negative-button {
    align-self: flex-start;
  }

  textarea {
    font-size: 1em;
    border: none;
    border-radius: 0;
    border-bottom: 1px solid ${colors.linkColor};
    width: 100%;
    height: 5em;
    padding: 0;
    resize: none;

    &.focus-visible {
      outline: none;
      box-shadow: none;
    }

    &[disabled] {
      opacity: 0.8;
      border-bottom: 1px solid ${colors.neutralBackgroundColor};
    }
  }

  .error-result {
    text-align: center;
    font-size: 16px;
    overflow: hidden;
    padding: 20px;
    font-weight: 400;
    margin: 0.5em;
    background-color: ${colors.negativeBackgroundColorTransparent};
  }
`;

export default StyledSendReportToAc;
