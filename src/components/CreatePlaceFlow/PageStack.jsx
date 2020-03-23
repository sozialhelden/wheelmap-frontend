// @flow
import * as React from 'react';
import styled from 'styled-components';

type Props = {
  className?: string,
  children?: React.Node,
};

const PageStack = (props: Props) => {
  return <div className={props.className}>{props.children}</div>;
};

export default styled(PageStack)`
  position: absolute;
  left: 0px;
  right: 0px;
  bottom: 0px;
  top: 0px;
  z-index: 10000;
  background-color: wheat;
  display: flex;
  padding: 5px;
`;
