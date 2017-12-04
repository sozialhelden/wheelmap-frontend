// @flow

import styled from 'styled-components';
import * as React from 'react';
import { dataSourceCache } from '../../lib/cache/DataSourceCache';
import type { AccessibilityCloudProperties } from '../../lib/Feature';
import colors from '../../lib/colors';
import ChevronRight from './ChevronRight';
import { t } from '../../lib/i18n';


type Props = {
  properties: AccessibilityCloudProperties,
  className: string,
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
      .getDataSourceWithId(props.properties.sourceId)
      .then(
        (source) => { this.setState({ sourceName: source.name }); },
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
    const infoPageUrl = properties.infoPageUrl;
    if (!infoPageUrl) return null;

    const sourceName = this.state.sourceName;
    const sourceNameString = String(sourceName);

    // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
    const unknownSourceNameCaption = t`Details`;
    // translator: Button caption in the place toolbar. Navigates to a place's details on an external page.
    const knownSourceNameCaption = t`View this place on ${sourceNameString}`;

    const caption = sourceName ? knownSourceNameCaption : unknownSourceNameCaption;

    return (<a href={infoPageUrl} className={`${className} link-button`}>
      {caption} <ChevronRight color={colors.linkColor} />
    </a>);
  }
}


const StyledSourceLink = styled(SourceLink)`
  margin-top: .5em;
  .chevron-right {
    vertical-align: bottom;
    height: 18px;
    width: 7px;
    min-width: 7px;
    margin: 0;
  }
`;


export default StyledSourceLink;
