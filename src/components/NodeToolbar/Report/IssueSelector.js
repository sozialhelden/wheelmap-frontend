// @flow
import React, { Component } from 'react';
import {
  accessibilityName,
  isWheelchairAccessible,
  Feature,
} from '../../../lib/Feature';

import WheelchairStatusEditor from '../AccessibilityEditor/WheelchairStatusEditor';
import ToiletStatusEditor from '../AccessibilityEditor/ToiletStatusEditor';
import FixComment from './FixComment';
import FixNonExistingPlace from './FixNonExistingPlace';
import FixPlacePosition from './FixPlacePosition';
import MailToSupport from './MailToSupport';


const issues = [
  {
    issueText(properties) {
      if (!properties) return null;
      const wheelchairAccessibilityName = accessibilityName(isWheelchairAccessible(properties));
      return `The place is marked as ‘${wheelchairAccessibilityName || ''}’, but this is wrong!`;
    },
    component: WheelchairStatusEditor,
  },
  {
    issueText: () => 'The place’s toilet status is wrong or missing.',
    component: ToiletStatusEditor,
  },
  {
    issueText: () => 'I have more information about this place.',
    component: FixComment,
  },
  {
    issueText: () => 'The place does not exist.',
    component: FixNonExistingPlace,
  },
  {
    issueText: () => 'The place is in the wrong position.',
    component: FixPlacePosition,
  },
  {
    issueText: () => 'My problem isn’t listed here…',
    component: MailToSupport,
  },
];

type Props = {
  feature: Feature,
  featureId: string | number | null,
  className: string,
  onClose: (() => void),
};

type State = {
  selectedComponentClass: React.Node,
};

export default class IssueSelector extends Component<void, Props, State> {
  props: Props = {};

  state = {
    selectedComponentClass: null,
  };

  componentWillReceiveProps(newProps: Props) {
    if (newProps.featureId !== this.props.featureId) {
      this.setState({ selectedComponentClass: null });
    }
  }

  render() {
    const { featureId, feature } = this.props;
    if (!featureId || !feature || !feature.properties) return null;
    if (this.state.selectedComponentClass) {
      return <this.state.selectedComponentClass feature={feature} featureId={featureId} />
    }
    return (<div>
      <header>Is there an issue with this place?</header>

      <ul className="issue-types">
        {issues.map((issue, i) =>
          (<li key={i}>
            <button
              className="link-button full-width-button"
              onClick={() => this.setState({ selectedComponentClass: issue.component })}
            >
              {issue.issueText(feature.properties)}
            </button>
          </li>)
        )}
      </ul>
    </div>);
  }
}