import styled from "styled-components";
import { Spinner } from "@radix-ui/themes";

const StyledDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function MapLoadingIndicator({
  className,
}: { className?: string }) {
  return (
    <StyledDiv className={className}>
      <Spinner size="3" />
    </StyledDiv>
  );
}
