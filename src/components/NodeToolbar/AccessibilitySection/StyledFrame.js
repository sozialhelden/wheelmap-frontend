// @flow

import styled from 'styled-components';
import colors from '../../../lib/colors';

import triangle from './triangle.svg';

const StyledFrame = styled.summary`
  position: relative;
  display: flex;
  flex-direction: column;
  margin: 0 0 1rem 0;
  padding: .75rem .75rem 2px .75rem;
  border: 1px solid ${colors.borderColor};
  border-radius: 4px;

  &:before {
    display: block;
    position: absolute;
    content: " ";
    top: -8px;
    left: 10px;
    width: 12px;
    height: 8px;
    background: url(${triangle}) no-repeat;
    z-index: 5;
  }

  > * {
    margin: 1rem 0;
  }

  > *:first-child {
    margin-top: 0;
  }

  > *:last-child {
    margin-bottom: 0;
  }

  header {
    :first-child {
      margin: 0;
    }
    &:not(:first-child) {
      margin: 0.25rem 0 0 0;
    }
  }

  > header > span {
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
`;

export default StyledFrame;
