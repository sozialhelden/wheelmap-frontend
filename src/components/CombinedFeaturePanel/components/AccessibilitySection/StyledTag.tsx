import { Tag } from "@blueprintjs/core";
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

  background-color: #a4bae530 !important;
  > header {
    background-color: #a4bae533 !important;
  }
`;

export default StyledTag;
