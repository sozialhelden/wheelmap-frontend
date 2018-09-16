// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import { Dots } from 'react-activity';

import Toolbar from '../Toolbar';
import CloseLink from '../CloseLink';
import ChevronRight from '../ChevronRight';
import CameraIcon from './CameraIcon';

import colors from '../../lib/colors';

import { accessibilityCloudImageCache } from '../../lib/cache/AccessibilityCloudImageCache';

export type Props = {
  hidden: boolean,
  photosMarkedForUpload: FileList | null,
  onClose: ?() => void,
  onCompleted: ?(photos: FileList, captchaSolution: string) => void,
  waitingForPhotoUpload?: boolean,
  photoCaptchaFailed?: boolean,
};

type State = {
  enteredCaptchaValue?: string,
  waitingForCaptcha: boolean,
  captchaError?: boolean | null,
  captcha: string | null,
};

// TODO: Move into potential GoButton-component
const StyledChevronRight = styled(ChevronRight)`
  height: 1rem;
  vertical-align: bottom;
  opacity: 0.5;
  g,
  polygon,
  rect,
  circle,
  path {
    fill: white;
  }
`;

// TODO: Move into new component to reuse
const GoButton = styled.button`
  min-width: 4rem;
  outline: none;
  border: none;
  font-size: 1rem;
  line-height: 1rem;

  color: white;
  background-color: ${colors.linkColor};
  &:hover {
    background-color: ${colors.linkColorDarker};
  }
  &:active {
    background-color: ${colors.darkLinkColor};
  }
  &[disabled] {
    opacity: 0.8;
    background-color: ${colors.neutralBackgroundColor};
  }
`;

/* Overwrite Style of wrapper Toolbar component  */
const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 0;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;

  /* TODO: Restyle CloseLink component in ToolBar */
  .close-link {
    min-width: 4rem;
    outline: none;
    border: none;
    font-size: 1.5rem;
    line-height: 1rem;
    color: ${colors.linkColor};
    background-color: transparent;

    &:hover {
      background-color: ${colors.linkBackgroundColor};
    }
    &:active {
      background-color: transparent;
    }
  }

  header {
    position: sticky;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    top: 0;
    height: 50px;
    min-height: 50px;
    z-index: 1;
    border-bottom: 1px ${colors.borderColor} solid;
    background: white;

    form {
      flex: 1;
      min-width: 100px;
      padding: 0;
      margin: 0;
      margin: 6px 10px 6px 0;
      display: block;

      input {
        font-size: 1em;
        border: none;
        border-radius: 0;
        border-bottom: 1px solid ${colors.linkColor};
        width: 100%;
        height: 2em;
        padding: 0;

        &.focus-visible {
          outline: none;
          box-shadow: none;
          /* border-bottom: none; */
        }

        &[disabled] {
          opacity: 0.8;
          border-bottom: 1px solid ${colors.neutralBackgroundColor};
        }
      }
    }
  }

  section.captcha-container {
    overflow: auto;

    section.captcha-error {
      border-radius: 0;
      border: none;
    }

    h3,
    .captcha-content {
      padding: 0 1rem;
    }

    h3 {
      margin-bottom: 0;
      text-align: center;
    }

    .captcha-content {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 1rem 1rem 0 1rem;

      > section.captcha-holder {
        padding-top: 0.75rem;
        text-align: center;

        svg {
          transform: scale(1.5);
        }
      }

      > button {
        margin-top: 0.25rem;
        font-size: 0.8rem;
        font-weight: bold;
        color: ${colors.linkColor};
        background: none;
        border: none;
      }
    }

    small.captcha-explanation {
      display: block;
      padding: 0 1rem 1.5rem 1rem;
      text-align: center;
    }
  }

  .captcha-error {
    text-align: center;
    margin: 5px;
    padding: 5px;
    background: #f5cdcd7a;
    border-radius: 10px;
    border: red dotted 1px;
  }

  .loading-captcha {
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    text-align: center;

    > div {
      padding: 0.25rem 0;
    }
  }

  .starting-upload-container > div {
    padding: 1rem;
    padding-bottom: 2rem;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    p {
      padding: 1rem 0;
    }
  }

  section.send-via-email a {
    padding: 12px 8px;
    background: ${colors.coldBackgroundColor};
    display: flex;
    flex-direction: row;
    justify-content: space-between;

    span.button-icon svg {
      display: inline-block;
      padding: 0 0.5rem 0 0.5rem;
      font-size: 2em;
    }
  }
`;

export default class PhotoUploadCaptchaToolbar extends React.Component<Props, State> {
  props: Props;

  state: State = {
    waitingForCaptcha: false,
    captchaError: null,
    captcha: null,
  };

  inputField: ?HTMLInputElement;
  backLink: ?React.ElementRef<typeof CloseLink>;
  goButton: ?React.ElementRef<'button'>;
  checkCaptchaTimer: number | null;
  toolbar: ?React.ElementRef<typeof Toolbar>;

  componentDidMount() {
    if (!this.props.hidden) {
      this.startTimer();
      this.focus(); // Focus input field on start
    }

    accessibilityCloudImageCache
      .getCaptcha()
      .then(captcha => {
        this.setState({ waitingForCaptcha: false, captcha, captchaError: false });
      })
      .catch(e => {
        this.setState({ captchaError: true });
      });
  }

  componentWillUnmount() {
    this.clearTimer();
  }

  componentWillReceiveProps(nextProps: Props) {
    if (!nextProps.hidden) {
      this.startTimer();
      if (this.toolbar) {
        this.toolbar.ensureFullVisibility();
      }
    } else if (nextProps.hidden) {
      this.clearTimer();
    }
  }

  startTimer() {
    if (!this.checkCaptchaTimer) {
      this.refreshCaptcha();
      this.checkCaptchaTimer = setInterval(this.refreshCaptcha, 5000);
    }
  }

  clearTimer() {
    if (this.checkCaptchaTimer !== null) {
      clearInterval(this.checkCaptchaTimer);
      this.checkCaptchaTimer = null;
    }
  }

  refreshCaptcha = () => {
    if (!accessibilityCloudImageCache.hasValidCaptcha()) {
      this.setState({ waitingForCaptcha: true });
      accessibilityCloudImageCache
        .getCaptcha()
        .then(captcha => {
          this.setState({ waitingForCaptcha: false, captcha, captchaError: false });
        })
        .catch(e => {
          this.setState({ captchaError: true });
        });
    }
  };

  focus() {
    this.inputField && this.inputField.focus();
  }

  renderInputField() {
    const isInputDisabled = !this.canEnter();
    return (
      <form onSubmit={this.onFinishPhotoUploadFlow}>
        <input
          type="text"
          ref={inputField => (this.inputField = inputField)}
          onFocus={event => {
            window.scrollTo(0, 0); // Fix iOS mobile safari viewport out of screen bug
          }}
          disabled={isInputDisabled}
          onChange={event => this.setState({ enteredCaptchaValue: event.target.value })}
          value={this.state.enteredCaptchaValue || ''}
          field="captcha-solution"
        />
      </form>
    );
  }

  renderBackLink() {
    return (
      <button
        className="close-link"
        // translator: Button caption in photo captcha dialog
        aria-label={t`Back`}
        onClick={() => {
          if (this.props.onClose) this.props.onClose();
        }}
        ref={backLink => (this.backLink = backLink)}
      >
        ←{' '}
      </button>
    );
  }

  renderGoButton() {
    // translator: button shown next to the captcha text input field
    const caption = t`Go`;
    const isGoDisabled = !this.canSubmit();
    return (
      <GoButton
        innerRef={button => (this.goButton = button)}
        onClick={this.onFinishPhotoUploadFlow}
        disabled={isGoDisabled}
      >
        {caption} <StyledChevronRight />
      </GoButton>
    );
  }

  renderForceRefreshButton() {
    // translator: button shown next to the captcha
    const caption = t`Show different characters`;
    const isGoDisabled = !this.canEnter();
    return (
      <button onClick={this.onForceRefreshCaptcha} disabled={isGoDisabled}>
        {caption}
      </button>
    );
  }

  onForceRefreshCaptcha = () => {
    this.clearTimer();
    accessibilityCloudImageCache.resetCaptcha();
    this.refreshCaptcha();
    this.startTimer();
  };

  onFinishPhotoUploadFlow = (event: UIEvent) => {
    if (this.props.onCompleted && this.props.photosMarkedForUpload) {
      if (!this.state.enteredCaptchaValue) {
        event.preventDefault();
        event.stopPropagation();
        return;
      }
      this.props.onCompleted(this.props.photosMarkedForUpload, this.state.enteredCaptchaValue);
      event.preventDefault();
      event.stopPropagation();
    } else if (this.props.onClose) {
      this.props.onClose();
      event.preventDefault();
      event.stopPropagation();
    }
  };

  canEnter() {
    return (
      !this.props.waitingForPhotoUpload && !this.state.captchaError && !this.state.waitingForCaptcha
    );
  }

  canSubmit() {
    const value = this.state.enteredCaptchaValue;
    const isValueOkay = value ? value.length > 0 : false;
    return this.canEnter() && isValueOkay;
  }

  render() {
    const { captcha, waitingForCaptcha, captchaError } = this.state;
    const { waitingForPhotoUpload, photoCaptchaFailed } = this.props;

    const mailHref = `mailto:photos@wheelmap.org?subject=${t`Image upload`}&body=${t`Hi Wheelmap Team, I have an image of the following place:`}`;

    const captions = {
      // translator: Shown while loading a captcha from the server. We try to avoid the word 'captcha' because normal users might not know what it means.
      loading: t`Loading...`,
      // translator: Shown above the captcha input field before uploading an image. We try to avoid the word 'captcha' because normal users might not know what it means.
      help: t`Please enter these characters.`,
      // translator: Shown below the captcha input field before uploading an image. We try to avoid the word 'captcha' because normal users might not know what it means.
      explanation: t`Then we know that you are human.`,
      // translator: Shown below the captcha input field before uploading an image. We try to avoid the word 'captcha' because normal users might not know what it means.
      emailHint: t`If you cannot read or enter this, please contribute your image via email!`,
      // translator: Shown while uploading an image after user has entered the captcha correctly. We try to avoid the word 'captcha' because normal users might not know what it means.
      startingUpload: t`Thanks! Starting to upload...`,
      // translator: Error message when captcha could not be loaded. We try to avoid the word 'captcha' because normal users might not know what it means.
      unreachable: t`Server cannot be reached. Please try again later and let us know if the problem persists!`,
      // translator: Error message when captcha was incorrectly entered. We try to avoid the word 'captcha' because normal users might not know what it means.
      invalid: t`Sorry, this did not work! Please check if all characters are correct, then retry.`,
    };

    return (
      <StyledToolbar
        className="captcha-toolbar"
        hidden={this.props.hidden}
        isSwipeable={false}
        isModal
        innerRef={toolbar => {
          this.toolbar = toolbar;
        }}
      >
        <header>
          {this.renderBackLink()}
          {this.renderInputField()}
          {this.renderGoButton()}
        </header>
        {!waitingForPhotoUpload && (
          <section className="captcha-container">
            {captchaError && <section className="captcha-error">{captions.unreachable}</section>}
            {photoCaptchaFailed && <section className="captcha-error">{captions.invalid}</section>}
            <div className="captcha-content">
              {captcha && (
                <section className="captcha-holder" dangerouslySetInnerHTML={{ __html: captcha }} />
              )}
              {captcha && this.renderForceRefreshButton()}
              {waitingForCaptcha && (
                <div className="loading-captcha">
                  {captions.loading}
                  <Dots />
                </div>
              )}
            </div>
            <h3 className="captcha-help">{captions.help}</h3>
            <small className="captcha-explanation">{captions.explanation}</small>
            <section className="send-via-email">
              <a href={mailHref}>
                <span className="button-icon">
                  <CameraIcon />
                </span>
                <small>{captions.emailHint}</small>
              </a>
            </section>
          </section>
        )}
        {waitingForPhotoUpload && (
          <section className="starting-upload-container">
            <div>
              <p>{captions.startingUpload}</p>
              <Dots />
            </div>
          </section>
        )}
      </StyledToolbar>
    );
  }
}
