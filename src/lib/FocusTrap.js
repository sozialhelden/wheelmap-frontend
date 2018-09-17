import React from 'react';
import { findDOMNode } from 'react-dom';
import createFocusTrap from 'focus-trap';

type Props = {
  component: React.Component,
};

class FocusTrap extends React.Component<Props> {
  constructor(props) {
    super(props);

    if (typeof document !== 'undefined') {
      this.previouslyFocusedElement = document.activeElement;
    }
  }

  componentDidMount() {
    const { focusTrapOptions } = this.props;

    // We need to hijack the returnFocusOnDeactivate option,
    // because React can move focus into the element before we arrived at
    // this lifecycle hook (e.g. with autoFocus inputs). So the component
    // captures the previouslyFocusedElement in the constructor,
    // then (optionally) returns focus to it in componentWillUnmount.
    const tailoredFocusTrapOptions = {
      ...focusTrapOptions,
      returnFocusOnDeactivate: false,
    };

    const topHtmlElement = findDOMNode(this.node);
    this.focusTrap = createFocusTrap(topHtmlElement, tailoredFocusTrapOptions);

    if (this.props.active) {
      this.focusTrap.activate();
    }
    if (this.props.paused) {
      this.focusTrap.pause();
    }
  }

  componentDidUpdate(prevProps) {
    if (prevProps.active && !this.props.active) {
      this.focusTrap.deactivate();
    } else if (!prevProps.active && this.props.active) {
      this.focusTrap.activate();
    }

    if (prevProps.paused && !this.props.paused) {
      this.focusTrap.unpause();
    } else if (!prevProps.paused && this.props.paused) {
      this.focusTrap.pause();
    }
  }

  componentWillUnmount() {
    this.focusTrap.deactivate();
    if (
      this.props.focusTrapOptions.returnFocusOnDeactivate !== false &&
      this.previouslyFocusedElement &&
      this.previouslyFocusedElement.focus
    ) {
      this.previouslyFocusedElement.focus();
    }
  }

  activateFocusTrap = () => {
    this.focusTrap.activate();
  };

  deactivateFocusTrap = () => {
    this.focusTrap.deactivate();
  };

  storeTopLevelElement = element => (this.node = element);

  render() {
    const composedRefCallback = this.props.ref
      ? element => {
          this.props.ref(element);
          this.storeTopLevelElement(element);
        }
      : this.storeTopLevelElement;

    const focusTrapProps = {
      ref: composedRefCallback,
      activateFocusTrap: this.activateFocusTrap,
      deactivateFocusTrap: this.deactivateFocusTrap,
    };

    const { component: WrappedComponent } = this.props;

    return <WrappedComponent {...this.props} {...focusTrapProps} />;
  }
}

export default FocusTrap;
