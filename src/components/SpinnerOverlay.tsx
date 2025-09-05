import { Spinner } from "@radix-ui/themes";
import styled from "styled-components";

const Overlay = styled.div<{ $offsetTop: string }>`
    inset: 0;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
    
    & > * {
        top: ${({ $offsetTop }) => $offsetTop || "0px"};
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

export function SpinnerOverlay({ offsetTop }: { offsetTop?: string }) {
  return (
    <Overlay $offsetTop={offsetTop}>
      <Spinner size="3" />
    </Overlay>
  );
}
