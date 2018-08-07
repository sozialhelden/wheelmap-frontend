// @flow

import { t } from 'ttag';
import * as React from 'react';
import styled from 'styled-components';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import type { AccessibilityCloudProperties } from '../../lib/Feature';
import WorldIcon from '../icons/actions/World';


type Props = {
  properties: AccessibilityCloudProperties,
  className: string,
  knownSourceNameCaption: ((string) => string),
  propertyName: 'infoPageUrl' | 'editPageUrl',
};

type State = {
  sourceName: ?string;
};

const defaultState: State = { sourceName: null };

class SourceLink extends React.Component<Props, State> {
  props: Props;
  state: State = defaultState;

  fetchSource(props: Props) {
    if (!props.properties || !props.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    dataSourceCache
      .getDataSourceWithId(String(props.properties.sourceId))
      .then(
        (source) => {
          if (source && typeof source.name === 'string') {
            this.setState({ sourceName: source.name });
          } else {
            this.setState(defaultState);
          }
      },
        () => { this.setState(defaultState); },
      );
  }

  componentDidMount() {
    this.fetchSource(this.props);
  }

  componentWillReceiveProps(newProps: Props) {
    this.fetchSource(newProps);
  }

  render() {
    const { properties, className } = this.props;
    const href = properties[this.props.propertyName];
    if (!href) return null;

    const sourceName = this.state.sourceName;
    const sourceNameString = String(sourceName);

    // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
    const unknownSourceNameCaption = t`Details`;
    const knownSourceNameCaption = this.props.knownSourceNameCaption(sourceNameString);

    const caption = sourceName ? knownSourceNameCaption : unknownSourceNameCaption;

    return (<a href={href} className={`${className} link-button`}>
      <WorldIcon />
      <span>{caption}</span>
    </a>);
  }
}


const StyledSourceLink = styled(SourceLink)`
  margin-top: .5em;
`;


export default StyledSourceLink;
