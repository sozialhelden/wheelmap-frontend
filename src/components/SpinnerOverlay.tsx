import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";

const Overlay = styled.div`
    inset: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    & > * {
        position: relative;
        z-index: 1;
    }
    
    &:after {
        position: absolute;
        display: block;
        content: "";
        inset: 0;
        background: var(--gray-a10);
        filter: invert(1);
        z-index: 0 !important;
    }
`;

export function SpinnerOverlay() {
  return (
    <Overlay>
      <Spinner size="3" />
    </Overlay>
  );
}
