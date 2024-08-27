import * as React from 'react';
import styled from 'styled-components';

export const Circle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

function UnstyledCaption(props: Partial<Props>) {
  return <div className={props.className}>{props.children}</div>;
}

export const Caption = styled(UnstyledCaption)`
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
`;

type Props = {
  caption: string | null;
  ariaLabel?: string | null;
  hasCircle?: boolean;
  isHorizontal?: boolean;
  className?: string;
  children?: React.ReactNode;
};

const StyledIconButtonContainer = styled.div<{ isHorizontal: boolean }>`
  display: flex;
  flex-direction: ${(props) => (props.isHorizontal ? 'row' : 'column')};
  flex-basis: 25%;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
`;

export default function IconButton(props: Props) {
  const icon = props.hasCircle ? (
    <Circle>{props.children}</Circle>
  ) : (
    props.children
  );

  return (
    <StyledIconButtonContainer
      className={props.className}
      aria-label={props.ariaLabel}
      isHorizontal={props.isHorizontal}
    >
      {icon}
      <Caption isHorizontal={props.isHorizontal}>{props.caption}</Caption>
    </StyledIconButtonContainer>
  );
}
