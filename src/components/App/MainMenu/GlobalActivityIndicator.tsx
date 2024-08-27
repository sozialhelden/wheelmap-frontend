import debounce from 'lodash/debounce';
import * as React from 'react';
import { globalFetchManager } from '../../lib/FetchManager';
import Spinner from '../ActivityIndicator/Spinner';

type Props = {
  className?: string;
};

type State = {
  isShown: boolean;
  lastError?: Error | null;
};

export default class GlobalActivityIndicator extends React.Component<Props, State> {
  state = { isShown: false };

  updateState = debounce(
    () => {
      const isShown = globalFetchManager.isLoading();
      const { lastError } = globalFetchManager;
      this.setState({ isShown, lastError });
    },
    50,
    { maxWait: 50, leading: true },
  );

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
      return <Spinner className={this.props.className} />;
    }
    return null;
  }
}
