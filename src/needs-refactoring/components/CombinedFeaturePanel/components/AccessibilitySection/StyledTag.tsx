import styled from "styled-components";

const StyledTag = styled.div`
  border-radius: 1rem;
  font-size: 0.9rem;

  display: flex;
  flex-direction: row;

  overflow: hidden;

  > * {
    padding: var(--space-1) 0.6666rem;
  }

  background-color: var(--gray-3) !important;
  color: var(--gray-12) !important;
  > header {
    background-color: var(--gray-4) !important;
    color: var(--gray-12) !important;
  }
`;

export default StyledTag;
