import React from 'react';
import createFocusTrap from 'focus-trap';

function withFocusTrap(WrappedComponent: React.ComponentType): React.ComponentType {
  return class FocusTrap extends React.Component {
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

      this.focusTrap = createFocusTrap(this.node, tailoredFocusTrapOptions);
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

    setNode = el => {
      this.node = el;
    };

    render() {
      const componentProps = {
        setupFocusTrap: this.setNode,
        activateFocusTrap: this.activateFocusTrap,
        deactivateFocusTrap: this.deactivateFocusTrap,
      };

      return <WrappedComponent {...this.props} {...componentProps} />;
    }
  };
}

export default withFocusTrap;
