// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';

import Toolbar from '../Toolbar';

import colors from '../../lib/colors';

import CloseLink from '../CloseLink';
import CustomRadio from '../NodeToolbar/AccessibilityEditor/CustomRadio';
import StyledRadioGroup from '../NodeToolbar/AccessibilityEditor/StyledRadioGroup';

import type { PhotoModel } from '../NodeToolbar/Photos/PhotoModel';

export type ReportOptions = 'wrong-place' | 'outdated' | 'offensive' | 'other';

const ReportValues: ReportOptions[] = ['wrong-place', 'outdated', 'offensive', 'other'];

function shortReportCaption(reportValue: ReportOptions): ?string {
  switch (reportValue) {
    case 'wrong-place':
      // translator: title for a report option where the photo does not match the place
      return t`Image shows another place`;
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

function reportDescription(reportValue: ReportOptions): ?string {
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
  hidden: boolean;
  photo: PhotoModel | null;
  onClose: () => void;
  onCompleted: (photo: PhotoModel, reason: ReportOptions) => void;
};

type State = {
  selectedValue: ReportOptions | null
};

/* Overwrite Style of wrapper Toolbar component  */
const StyledToolbar = styled(Toolbar)`
  transition: opacity 0.3s ease-out, transform 0.15s ease-out, width: 0.15s ease-out, height: 0.15s ease-out;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  border-top: none;
  border-radius: 3px;
  z-index: 1000;

  > header {
    position: sticky;
    display: flex;
    flex-direction: column;
    top: 0;
    z-index: 1;
    height: 200px;

    .close-link {
      position: absolute;
      right: 0px;
    }

    > div {
      display: flex;
    }

    img {
      margin: 0;      
      width: 100%;
      object-fit: contain;
    }

    h3 {
      margin: 0.75rem 0;
    }
  }

  > .radio-group {
    margin-top: 1em;
    flex: 1;
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
  
  .link-button[disabled] {
    opacity: 0.8;
    background-color: ${colors.neutralBackgroundColor};
  }
`;

export default class PhotoUploadInstructionsToolbar extends React.Component<Props, State> {
  props: Props;

  state: State = {
    selectedValue: null
  };

  renderCloseLink() {
    return <CloseLink onClick={this.onClose} />;
  }

  onSubmit = (event: SyntheticEvent<HTMLInputElement>) => {
    if (this.props.onCompleted && this.props.photo && this.state.selectedValue) {
      this.props.onCompleted(this.props.photo, this.state.selectedValue);
      event.preventDefault();
    }
  };

  onClose = (event: UIEvent) => {
    if (this.props.onClose) {
      this.props.onClose();
      event.preventDefault();
    }
  };

  onRadioGroupKeyDown = (event: SyntheticEvent<HTMLInputElement>) => {
    if (event.nativeEvent.key === 'Enter') {
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
    const ariaLabel = t`Reason for reporting image.`;

    return <StyledToolbar className="photoupload-instructions-toolbar" hidden={this.props.hidden} isSwipeable={false} isModal>
        <header>
          {this.renderCloseLink()}
          <div>
            <img src={photo.src} alt={t`To report`} />
          </div>
          <h3>{t`Which problem would you like to report?`}</h3>
        </header>

        <StyledRadioGroup name="report-reason" selectedValue={selectedValue} onChange={newValue => {
        this.setState({ selectedValue: newValue });
      }} className={`${selectedValue ? 'has-selection' : ''} radio-group`} onKeyDown={this.onRadioGroupKeyDown} role="radiogroup" aria-label={ariaLabel}>
          {ReportValues.map((value: ReportOptions, index) => <CustomRadio key={value} shownValue={value} currentValue={selectedValue} caption={shortReportCaption(value)} description={reportDescription(value)} />)}
        </StyledRadioGroup>

        <footer>
          <button className="link-button negative-button" onClick={this.onClose}>
            {t`Cancel`}
          </button>
          <button className="link-button primary-button" disabled={!canSubmit} onClick={this.onSubmit}>
            {t`Send`}
          </button>
        </footer>
      </StyledToolbar>;
  }
}