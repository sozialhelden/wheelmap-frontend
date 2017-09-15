// @flow
import React, { Component } from 'react';
import SourceLink from '../SourceLink';
import type { Feature } from '../../../lib/Feature';
import { dataSourceCache } from '../../../lib/cache/DataSourceCache';

type Props = {
  featureId: number,
  feature: Feature,
  onClose: (() => void),
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
    const { feature } = this.props;
    if (!feature || !feature.properties) return null;
    const properties = feature.properties;

    const sourceName = this.state.sourceName;

    return (<section>
      <p>
        Information about this place has kindly been provided by another organization ({sourceName || 'somebody else'}).
      </p>
      {properties.infoPageUrl ? (<div>
        <p>
          Use the link below to see or change the place.
        </p>
        <p className="subtle">(Note that it can take a while until the place is updated on Wheelmap after editing.)</p>
        <SourceLink properties={properties} />
      </div>) : null}
      <button className="link-button negative-button" onClick={this.props.onClose}>Back</button>
    </section>);
  }
}

export default FixOnExternalPage;
