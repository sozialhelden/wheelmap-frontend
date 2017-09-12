// @flow
import React, { Component } from 'react';
import styled from 'styled-components';

import {
  accessibilityName,
  isWheelchairAccessible,
  Feature,
  isWheelmapFeatureId,
} from '../../../lib/Feature';

import WheelchairStatusEditor from '../AccessibilityEditor/WheelchairStatusEditor';
import ToiletStatusEditor from '../AccessibilityEditor/ToiletStatusEditor';
import FixComment from './FixComment';
import FixNonExistingPlace from './FixNonExistingPlace';
import FixPlacePosition from './FixPlacePosition';
import MailToSupport from './MailToSupport';
import FixOnExternalPage from './FixOnExternalPage';


const issues = properties => [
  {
    className: 'wrong-wheelchair-accessibility',
    issueText() {
      const wheelchairAccessibilityName = accessibilityName(isWheelchairAccessible(properties));
      return `The place is marked as ‘${wheelchairAccessibilityName || ''}’, but this is wrong!`;
    },
    component: WheelchairStatusEditor,
  },
  (isWheelchairAccessible(properties) !== 'unknown') ? {
    className: 'wrong-toilet-accessibility',
    issueText: () => 'The place’s toilet status is wrong or missing.',
    component: ToiletStatusEditor,
  } : null,
  {
    className: 'information-missing',
    issueText: () => 'I have more information about this place.',
    component: FixComment,
  },
  {
    className: 'non-existing-place',
    issueText: () => 'The place does not exist.',
    component: FixNonExistingPlace,
  },
  {
    className: 'wrong-position',
    issueText: () => 'The place is in the wrong position.',
    component: FixPlacePosition,
  },
  {
    className: 'other-issue',
    issueText: () => 'My problem isn’t listed here…',
    component: MailToSupport,
  },
].filter(Boolean);


type Props = {
  feature: Feature,
  featureId: string | number | null,
  className: string,
  onClose: (() => void),
  onCloseButtonChanged: (() => void),
};

type State = {
  SelectedComponentClass: ?Class<Component<*, *>>,
};

class ReportDialog extends Component<Props, State> {
  props: Props;

  state = {
    SelectedComponentClass: null,
  };

  componentWillReceiveProps(newProps: Props) {
    if (newProps.featureId !== this.props.featureId) {
      this.setState({ SelectedComponentClass: null });
    }
    if (!isWheelmapFeatureId(newProps.featureId)) {
      this.setState({ SelectedComponentClass: FixOnExternalPage });
    }
  }

  render() {
    const { featureId, feature } = this.props;
    if (!featureId || !feature || !feature.properties) return null;

    const ComponentClass = this.state.SelectedComponentClass;

    if (ComponentClass) {
      return (<ComponentClass
        feature={feature}
        featureId={featureId}
        onClose={this.props.onClose}
      />);
    }

    return (<div className={this.props.className}>
      <header>Is there an issue with this place?</header>

      <ul className="issue-types">
        {issues(feature.properties).map(issue =>
          (<li key={issue.className} className={issue.className}>
            <button
              className={`link-button full-width-button ${issue.className}`}
              onClick={() => {
                this.setState({ SelectedComponentClass: issue.component });
              }}
            >
              {issue.issueText()}
            </button>
          </li>))}
      </ul>

      <button className="link-button negative-button" onClick={this.props.onClose}>Back</button>
    </div>);
  }
}


const StyledReportDialog = styled(ReportDialog)`
  ul.issue-types {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;

export default StyledReportDialog;
