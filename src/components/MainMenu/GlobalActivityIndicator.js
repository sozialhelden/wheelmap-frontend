// @flow
import debounce from 'lodash/debounce';
import { Dots } from 'react-activity';
import * as React from 'react';
import { globalFetchManager } from '../../lib/FetchManager';

type State = {
  isShown: boolean;
  lastError: ?Error;
}

export default class GlobalActivityIndicator extends React.Component<void, State> {
  state = { isShown: false };

  updateState = debounce(() => {
    const isShown = globalFetchManager.isLoading();
    const lastError = globalFetchManager.lastError;
    this.setState({ isShown, lastError });
  }, 50, { maxWait: 50, leading: true });

  componentDidMount() {
    globalFetchManager.addEventListener('start', this.updateState);
    globalFetchManager.addEventListener('stop', this.updateState);
    globalFetchManager.addEventListener('error', this.updateState);
  }

  componentWillUnmount() {
    globalFetchManager.removeEventListener('start', this.updateState);
    globalFetchManager.removeEventListener('stop', this.updateState);
    globalFetchManager.removeEventListener('error', this.updateState);
  }

  render() {
    if (this.state.isShown) {
      return <Dots />;
    }
    return null;
  }
}
