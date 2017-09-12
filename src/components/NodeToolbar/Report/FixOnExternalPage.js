// @flow
import React, { Component } from 'react';
import SourceLink from '../SourceLink';
import type { Feature } from '../../../lib/Feature';
import { dataSourceCache } from '../../../lib/cache/DataSourceCache';

type Props = {
  featureId: number,
  feature: Feature,
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
    const { properties } = this.props;

    const sourceName = this.state.sourceName;

    return (<section>
      <p>
        Information about this place has kindly been provided by another organization ({sourceName || 'somebody else'}).
      </p>
      {properties.infoPageUrl ? (<div>
        <p>
          You can use the link below to see or change the data.
        </p>
        <p className="subtle">(Note that it can take a while until the place is updated on Wheelmap.)</p>
        <SourceLink properties={properties} />
      </div>) : null}
    </section>);
  }
}

export default FixOnExternalPage;
