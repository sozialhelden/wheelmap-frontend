import styled from "styled-components";

const StyledTag = styled.div`
  border-radius: 1rem;
  font-size: 0.9em;

  display: flex;
  flex-direction: row;

  overflow: hidden;

  > * {
    padding: 0.25rem 0.6666rem;
  }

  background-color: var(--gray-a3) !important;
  color: var(--gray-12) !important;
  > header {
    background-color: var(--gray-a6) !important;
    color: var(--gray-12) !important;
  }
`;

export default StyledTag;
