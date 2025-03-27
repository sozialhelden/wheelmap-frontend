import styled from "styled-components";

import { Spinner } from "@radix-ui/themes";
import colors from "~/needs-refactoring/lib/util/colors";

const StyledDiv = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: ${colors.neutralBackgroundColor};
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
