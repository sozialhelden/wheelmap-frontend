import styled from "styled-components";
import Spinner from "../ActivityIndicator/Spinner";

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
      <Spinner size={30} color="rgba(0, 0, 0, 0.4)" />
    </StyledDiv>
  );
}
