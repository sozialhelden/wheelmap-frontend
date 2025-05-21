import type React from "react";
import styled from "styled-components";

interface Props {
  children: React.ReactNode;
}

const StyledSection = styled.div`
    padding: var(--space-4);
    display: flex; 
    flex-direction: column; 
    gap: var(--space-3);
`;

const Section = ({ children }: Props) => {
  return <StyledSection>{children}</StyledSection>;
};
export default Section;
