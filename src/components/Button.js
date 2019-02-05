// @flow
import styled from 'styled-components';

import colors from '../lib/colors';
import Link from './Link/Link';

const StyledButton = styled.button`
  appearance: none;
  font: inherit;
  background: none;
  padding: 0;
  margin: 0;
  border-radius: 0;
  border: 0;
  display: block;
  text-align: left;
  width: 100%;
`;

export const ChromelessButton = styled.button`
  padding: 0.5rem 0.75rem;
  border: none;
  box-shadow: 0px 0px 0px 1px transparent;
  border-radius: 0.5rem;
  @media (max-width: 768px) {
    box-shadow: 0px 0px 0px 1px transparent;
  }
  &[data-focus-visible-added] {
    box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
    transition: box-shadow 0.2s;
  }
  font-size: 1rem;
  @media (max-height: 320px), (max-width: 320px) {
    font-size: 0.9rem;
  }
  background-color: transparent;
  color: ${colors.textColorTonedDown};
  cursor: pointer;
`;

export const CallToActionButton = styled.button`
  border: none;
  color: white;
  background-color: ${colors.linkColor};
  font-size: 1.25em;
  line-height: 1;
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;

  > svg {
    margin-left: 10px;
    vertical-align: bottom;
    path,
    polygon {
      fill: rgba(255, 255, 255, 0.75);
    }
  }

  &[data-focus-visible-added] {
    box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
    transition: box-shadow 0.2s;
  }
`;

export const CallToActionLink = styled.a`
  border: none;
  color: white !important;
  background-color: ${colors.linkColor};
  font-size: 1.25em;
  line-height: 1;
  padding: 0.5em 0.75em;
  border-radius: 0.5rem;
  cursor: pointer;
  display: inline-flex;
  justify-content: space-between;

  > svg {
    margin-left: 10px;
    vertical-align: bottom;
    path,
    polygon {
      fill: rgba(255, 255, 255, 0.75);
    }
  }

  &[data-focus-visible-added] {
    box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
    transition: box-shadow 0.2s;
  }
`;

export default StyledButton;
