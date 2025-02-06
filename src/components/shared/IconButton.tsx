import type * as React from "react";
import styled from "styled-components";

type IconButtonProps = {
  caption: string | null;
  hasCircle?: boolean;
  isHorizontal?: boolean;
} & React.HTMLAttributes<HTMLDivElement>;

export const Circle = styled.div`
  width: 35px;
  height: 35px;
  border-radius: 500px;
  display: flex;
  justify-content: center;
  align-items: center;
  box-sizing: border-box;
`;

function UnstyledCaption(props: Partial<IconButtonProps>) {
  return <div className={props.className}>{props.children}</div>;
}

export const Caption = styled(UnstyledCaption)`
  color: rgba(0, 0, 0, 0.8);
  line-height: 1.2;
`;

const StyledIconButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 25%;
  align-items: center;
  box-sizing: border-box;
  padding: 10px 0;
  text-align: center;
  text-decoration: none;
  cursor: pointer;
    
  &[data-is-horizontal='true'] {
    flex-direction: row;
  }
`;

export default function IconButton({
  hasCircle,
  isHorizontal,
  caption,
  children,
  ...props
}: IconButtonProps) {
  const icon = hasCircle ? <Circle>{children}</Circle> : children;

  return (
    <StyledIconButtonContainer data-is-horizontal={isHorizontal} {...props}>
      {icon}
      <Caption isHorizontal={isHorizontal}>{caption}</Caption>
    </StyledIconButtonContainer>
  );
}
