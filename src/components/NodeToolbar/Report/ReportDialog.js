// @flow
import * as React from 'react';
import styled from 'styled-components';
import {
  accessibilityName,
  isWheelchairAccessible,
  isWheelmapFeatureId,
} from '../../../lib/Feature';

import { t } from '../../../lib/i18n';
import type { Feature } from '../../../lib/Feature';

import strings from './strings';
import FixComment from './FixComment';
import MailToSupport from './MailToSupport';
import FixPlacePosition from './FixPlacePosition';
import FixOnExternalPage from './FixOnExternalPage';
import FixNonExistingPlace from './FixNonExistingPlace';
import WheelchairStatusEditor from '../AccessibilityEditor/WheelchairStatusEditor';
import ToiletStatusEditor from '../AccessibilityEditor/ToiletStatusEditor';


const issues = properties => [
  {
    className: 'wrong-wheelchair-accessibility',
    issueText() {
      const accessibilityDescription = accessibilityName(isWheelchairAccessible(properties)) || '';
      // translator: Shown as issue description in the report dialog
      return t`The place is marked as ‘${accessibilityDescription}’, but this is wrong!`;
    },
    component: WheelchairStatusEditor,
  },
  (isWheelchairAccessible(properties) !== 'unknown') ? {
    className: 'wrong-toilet-accessibility',
    // translator: Shown as issue description in the report dialog
    issueText: () => t`The place’s toilet status is wrong or missing.`,
    component: ToiletStatusEditor,
  } : null,
  {
    className: 'information-missing',
    // translator: Shown as issue description in the report dialog
    issueText: () => t`I have more information about this place.`,
    component: FixComment,
  },
  {
    className: 'non-existing-place',
    // translator: Shown as issue description in the report dialog
    issueText: () => t`The place does not exist.`,
    component: FixNonExistingPlace,
  },
  {
    className: 'wrong-position',
    // translator: Shown as issue description in the report dialog
    issueText: () => t`The place is in the wrong position.`,
    component: FixPlacePosition,
  },
  {
    className: 'other-issue',
    // translator: Shown as issue description in the report dialog
    issueText: () => t`My problem isn’t listed here…`,
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

class ReportDialog extends React.Component<Props, State> {
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
    const { backButtonCaption, reportIssueHeader } = strings();

    if (ComponentClass) {
      return (<ComponentClass
        feature={feature}
        featureId={featureId}
        onClose={this.props.onClose}
      />);
    }

    return (<div className={this.props.className}>
      <header>{reportIssueHeader}</header>

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

      <button className="link-button negative-button" onClick={this.props.onClose}>
        {backButtonCaption}
      </button>
    </div>);
  }
}


const StyledReportDialog = styled(ReportDialog)`
  header {
    margin-bottom: 0.5em;
  }
  ul.issue-types {
    margin: 0;
    padding: 0;
    list-style-type: none;
  }
`;

export default StyledReportDialog;
