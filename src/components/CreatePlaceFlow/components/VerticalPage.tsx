// @flow
import FocusTrap, { FocusTarget } from 'focus-trap-react';
import * as React from 'react';
import styled from 'styled-components';

function VerticalPage(props: {
  className: string,
  children: React.ReactNode,
  initialFocus: FocusTarget,
}) {
  var pageRoot = React.useRef<HTMLElement | null>();

  return (
    <FocusTrap
      focusTrapOptions={{
        initialFocus: props.initialFocus,
        fallbackFocus: pageRoot.current || 'body',
      }}
    >
      <div ref={pageRoot} className={props.className} tabIndex={-1}>
        {props.children}
      </div>
    </FocusTrap>
  );
}

export default styled(VerticalPage)`
  display: flex;
  flex-direction: column;
  background: white;
  padding-left: 24px;
  padding-right: 24px;
  flex: 1;
  border-radius: 8px;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.3);
  max-width: 600px;
  height: 100%;

  overflow-y: auto;
  overflow-x: hidden;

  overscroll-behavior-y: contain;
  touch-action: pan-y;
  -webkit-user-drag: none;
`;
