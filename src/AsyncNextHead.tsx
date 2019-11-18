import React, { ReactElement } from 'react';
import Head from 'next/head';

type Props = {
  head: ReactElement<any> | Promise<ReactElement<any>>,
};

type State = {
  head: ReactElement<any>,
  headPromise: Promise<ReactElement<any>>,
};

class AsyncNextHead extends React.PureComponent<Props, State> {
  state = {
    head: null,
    headPromise: null,
  };

  static getDerivedStateFromProps(props: Props, state: State): Partial<State> {
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

  handlePromiseFetched(headPromise: Promise<ReactElement<any>>, head: ReactElement<any>) {
    if (this.state.headPromise !== headPromise) {
      return;
    }

    this.setState({
      head,
    });
  }

  render() {
    if (!this.state.head) {
      return null;
    }

    return <Head>{this.state.head}</Head>;
  }
}

export default AsyncNextHead;
