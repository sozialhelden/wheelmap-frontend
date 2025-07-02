import styled from "styled-components";
import { breakpoints } from "~/hooks/useBreakpoints";

const HeaderImageSection = styled.div<{
  $orderDesktop?: number;
  $orderMobile?: number;
}>`
    display: flex;
    width: calc(100% + var(--space-3) * 2); 
    height: 15rem; 
    margin-left: calc(-1 * var(--space-3)); 
    margin-right: calc(-1 * var(--space-3)); 
    margin-bottom: var(--space-5);
    background: var(--gray-4);
    img { width: 100%; height: 100%; object-fit: cover; display: block; };
    order: ${(props) => props.$orderMobile};
    @media (min-width: ${breakpoints.xs}px) {
        order: ${(props) => props.$orderDesktop};
    }
    
  `;

export default HeaderImageSection;
