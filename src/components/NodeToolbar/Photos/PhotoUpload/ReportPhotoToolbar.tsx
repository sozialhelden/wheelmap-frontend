import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import StyledToolbar from '../NodeToolbar/StyledToolbar';

import colors from '../../lib/colors';

import CloseLink from '../CloseLink';
import CustomRadio from '../NodeToolbar/AccessibilityEditor/CustomRadio';
import StyledRadioGroup from '../NodeToolbar/AccessibilityEditor/StyledRadioGroup';

import { PhotoModel } from '../../lib/PhotoModel';
import CloseButton from '../CloseButton';

export type ReportOptions = 'wrong-place' | 'outdated' | 'offensive' | 'other';

const ReportValues: ReportOptions[] = ['wrong-place', 'outdated', 'offensive', 'other'];

function shortReportCaption(reportValue: ReportOptions): string | null {
  switch (reportValue) {
    case 'wrong-place':
      // translator: title for a report option where the photo does not match the place
      return t`Image shows another place.`;
    case 'outdated':
      // translator: title for a report option where the photo does not match the current state of the place
      return t`Outdated`;
    case 'offensive':
      // translator: title for a report option where the photo is nsfw
      return t`Offensive or inappropriate`;
    case 'other':
      // translator: title for a report option where the photo has another problem
      return t`Other problems`;
    default:
      return null;
  }
}

function reportDescription(reportValue: ReportOptions): string | null {
  switch (reportValue) {
    case 'wrong-place':
      // translator: title for a report option where the photo does not match the place
      return t`This image does not depict this place.`;
    case 'outdated':
      // translator: title for a report option where the photo does not match the current state of the place
      return t`This image does not show the current state of this place.`;
    case 'offensive':
      // translator: title for a report option where the photo is nsfw
      return t`This image shows sexually explicit content, depicts violence or is inappropriate in another way.`;
    case 'other':
      // translator: title for a report option where the photo has another problem
      return t`This image infringes on my copyright or has other problems.`;
    default:
      return null;
  }
}

export type Props = {
  className?: string,
  hidden: boolean,
  photo: PhotoModel | null,
  onClose: () => void,
  onCompleted: (photo: PhotoModel, reason: ReportOptions) => void,
};

type State = {
  selectedValue: ReportOptions | null,
};

class ReportPhotoToolbar extends React.Component<Props, State> {
  props: Props;

  state: State = {
    selectedValue: null,
  };

  renderCloseLink() {
    return <CloseLink onClick={this.onClose} />;
  }

  onSubmit = (
    event: React.MouseEvent<HTMLButtonElement> | React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (this.props.onCompleted && this.props.photo && this.state.selectedValue) {
      this.props.onCompleted(this.props.photo, this.state.selectedValue);
      event.preventDefault();
    }
  };

  onClose = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (this.props.onClose) {
      this.props.onClose();
      event.preventDefault();
    }
  };

  onRadioGroupKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      this.onSubmit(event);
    }
  };

  render() {
    const { photo } = this.props;
    const { selectedValue } = this.state;

    if (!photo) {
      return null;
    }

    const canSubmit = !!selectedValue;

    // translator: Screen reader description for the 'report photo' reason choice dialog
    const ariaLabel = t`Reason for reporting image`;

    return (
      <StyledToolbar
        className={this.props.className}
        hidden={this.props.hidden}
        isSwipeable={false}
        minimalHeight={180}
        isModal
      >
        <header>
          <CloseButton onClick={this.onClose} />
          <h3>{t`Which problem would you like to report?`}</h3>
        </header>

        <div className="image-container">
          <img src={photo.src} alt={t`To report`} />
        </div>

        <StyledRadioGroup
          name="report-reason"
          selectedValue={selectedValue}
          onChange={(newValue) => {
            this.setState({ selectedValue: newValue });
          }}
          className={`${selectedValue ? 'has-selection' : ''} radio-group`}
          onKeyDown={this.onRadioGroupKeyDown}
          role="radiogroup"
          aria-label={ariaLabel}
        >
          {ReportValues.map((value: ReportOptions, index) => (
            <CustomRadio
              key={value}
              shownValue={value}
              currentValue={selectedValue}
              caption={shortReportCaption(value)}
              description={reportDescription(value)}
            />
          ))}
        </StyledRadioGroup>

        <footer>
          <button className="link-button negative-button" onClick={this.onClose}>
            {t`Cancel`}
          </button>
          <button
            className="link-button primary-button"
            disabled={!canSubmit}
            onClick={this.onSubmit}
          >
            {t`Send`}
          </button>
        </footer>
      </StyledToolbar>
    );
  }
}

export default styled(ReportPhotoToolbar)`
  > div > header {
    display: flex;
    position: sticky;
    flex-direction: column;
    top: 0;
    margin: -16px;
    min-height: 50px;
    z-index: 1;
    background-color: white;
    h3 {
      margin: 8px 16px;
      padding-right: 40px;
    }
  }

  .image-container {
    margin-top: 50px;
    height: 200px;
  }

  img {
    margin: 0;
    width: 100%;
    max-height: 200px;
    object-fit: contain;
  }

  > .radio-group {
    margin-top: 1em;
    overflow-y: auto;
    overflow-x: hidden;
  }

  > footer {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    height: 50px;

    label.link-button {
      text-align: center;
    }
  }

  ${CloseButton} {
    position: absolute;
    top: 0px;
    right: 0px;
  }

  .link-button[disabled] {
    opacity: 0.8;
    background-color: ${colors.neutralBackgroundColor};
  }
`;
