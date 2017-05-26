import styled from 'styled-components';
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import colors from '../../lib/colors';

const Circle = styled.div.attrs({ className: 'circle' })`
  width: 35px;
  height: 35px;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

const StyledButtonIcon = styled.img`
  width: 21px;
  opacity: 0.95;
`;

// ^ add in later when supporting button icons as svg components
// height: 46px;
// fill: #2d2d2d;

const StyledLink = styled(NavLink)`
  display: flex;
  flex-basis: 25%;
  flex-direction: column;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;

  .circle {
    background-color: ${colors.tonedDownSelectedColor};
  }
  &.active .circle {
    background-color: ${colors.selectedColor};
  }
  &:focus {
    outline: none;
    .circle {
      background-color: ${colors.selectedColor};
    }
  }
`;

const Caption = styled.div`
  font-size: 0.75em;
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
  margin-top: 0.5em;
`;

type Props = {
  name: string,
  id: string,
};

export default function CategoryButton(props: Props) {
  const url = `/categories/${props.id}`;

  return (
    <StyledLink activeClassName='active' to={url}>
      <Circle>
        <StyledButtonIcon
          src={`/icons/main-categories/white/${props.id}.svg`}
          alt={`${name}-icon`}
        />
      </Circle>
      <Caption>{props.name}</Caption>
    </StyledLink>
  );
}
