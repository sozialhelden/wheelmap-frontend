import * as React from 'react';

import styled from 'styled-components';
import colors from '../../lib/colors';
import ChevronLeft from '../ChevronLeft';
import { ChromelessButton } from '../Button';

type Props = {
  onClick: () => void,
  className: ?string,
  children: React.ReactChildren,
};

const BackButton = ({ onClick, children, className }): Props => (
  <ChromelessButton className={className} onClick={onClick}>
    <ChevronLeft />
    {children}
  </ChromelessButton>
);

export default styled(BackButton)`
  display: flex;
  padding: 0;

  &:hover {
    background-color: transparent;
    color: ${colors.linkColor};
  }

  ${ChevronLeft} {
    margin: 0 0.5rem 0 0;
    width: 1rem;
    height: 2rem;
  }
`;
