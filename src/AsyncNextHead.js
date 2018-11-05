// @flow
import React from 'react';
import Head from 'next/head';

type Props = {
  head: ?React$Element<any> | ?Promise<React$Element<any>>,
};

type State = {
  head: ?React$Element<any>,
  headPromise: ?Promise<React$Element<any>>,
};

class AsyncNextHead extends React.PureComponent<Props, State> {
  state = {
    head: null,
    headPromise: null,
  };

  static getDerivedStateFromProps(props: Props, state: State): $Shape<State> {
    const { head } = props;

    // Do not update anything when the same promise or head is already in use.
    if (head === state.headPromise || head === state.head) {
      return null;
    }

    if (head instanceof Promise) {
      return { head: null, headPromise: head };
    }

    return { head: head, headPromise: null };
  }

  componentDidMount() {
    const { headPromise } = this.state;

    if (headPromise) {
      headPromise.then(head => this.handlePromiseFetched(headPromise, head));
    }
  }

  componentDidUpdate(prevProps: Props, prevState: State) {
    const { headPromise } = this.state;

    if (headPromise && prevState.headPromise !== headPromise) {
      headPromise.then(head => this.handlePromiseFetched(headPromise, head));
    }
  }

  handlePromiseFetched(headPromise: Promise<React$Element<any>>, head: React$Element<any>) {
    if (this.state.headPromise !== headPromise) {
      return;
    }

    this.setState({
      head,
    });
  }

  render() {
    return <Head>{this.state.head}</Head>;
  }
}

export default AsyncNextHead;
