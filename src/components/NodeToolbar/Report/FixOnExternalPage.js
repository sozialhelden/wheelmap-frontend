// @flow
import strings from './strings';
import React, { Component } from 'react';
import SourceLink from '../SourceLink';
import type { Feature, AccessibilityCloudProperties } from '../../../lib/Feature';
import { dataSourceCache } from '../../../lib/cache/DataSourceCache';

type Props = {
  feature: Feature,
  onClose: (() => void),
  properties: AccessibilityCloudProperties,
};

type State = {
  sourceName: ?string;
};

const defaultState: State = { sourceName: null };

class FixOnExternalPage extends Component<Props, State> {
  props: Props;
  state: State = defaultState;

  fetchSource(props: Props) {
    if (!props.properties || !props.properties.sourceId) {
      this.setState(defaultState);
      return;
    }
    const sourceId = props.properties.sourceId;

    if (typeof sourceId !== 'string') return;

    dataSourceCache
      .getDataSourceWithId(sourceId)
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
    const { feature } = this.props;
    if (!feature || !feature.properties) return null;
    const properties = feature.properties;

    const sourceName = this.state.sourceName;
    const {
      externalDataHint,
      useLinkExplanation,
      editingDelayExplanation,
      backButtonCaption,
    } = strings;

    return (<section>
      <p>
        {externalDataHint}{sourceName ? ` ({sourceName})` : null}.
      </p>
      {properties.infoPageUrl ? (<div>
        <p>
          {useLinkExplanation}
        </p>
        <p className="subtle">{editingDelayExplanation}</p>
        <SourceLink properties={properties} />
      </div>) : null}
      <button className="link-button negative-button" onClick={this.props.onClose}>{backButtonCaption}</button>
    </section>);
  }
}

export default FixOnExternalPage;
