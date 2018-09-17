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
    // We need to hijack the returnFocusOnDeactivate option,
    // because React can move focus into the element before we arrived at
    // this lifecycle hook (e.g. with autoFocus inputs). So the component
    // captures the previouslyFocusedElement in componentWillMount,
    // then (optionally) returns focus to it in componentWillUnmount.
    const specifiedFocusTrapOptions = this.props.focusTrapOptions;
    const tailoredFocusTrapOptions = {
      returnFocusOnDeactivate: false,
    };

    for (const optionName in specifiedFocusTrapOptions) {
      if (!specifiedFocusTrapOptions.hasOwnProperty(optionName)) continue;
      if (optionName === 'returnFocusOnDeactivate') continue;
      tailoredFocusTrapOptions[optionName] = specifiedFocusTrapOptions[optionName];
    }

    const topHtmlElement = findDOMNode(this.node);

    this.focusTrap = createFocusTrap(topHtmlElement, tailoredFocusTrapOptions);
  }

  componentWillUnmount() {
    this.focusTrap.deactivate();
    if (this.previouslyFocusedElement && this.previouslyFocusedElement.focus) {
      this.previouslyFocusedElement.focus();
    }
  }

  activateFocusTrap = () => {
    this.focusTrap.activate();
  };

  deactivateFocusTrap = () => {
    this.focusTrap.deactivate();
  };

  storeTopLevelElement = el => (this.node = el);

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
