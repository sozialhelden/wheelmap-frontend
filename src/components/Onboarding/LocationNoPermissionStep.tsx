import { FC, useContext } from "react";
import styled from "styled-components";
import { AppContext } from "../../lib/context/AppContext";
import SearchInputField from "../SearchPanel/SearchInputField";
import { CallToActionButton } from "../shared/Button";
import StyledMarkdown from "../shared/StyledMarkdown";
import {
  LocationNoPermissionPrimaryText,
  LocationSearchContinueText,
  selectProductName,
} from "./language";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;

  h1 {
    @media (min-width: 414px) {
      font-size: 1.25rem;
    }
    @media (min-height: 414px) {
      font-size: 1.25rem;
    }
  }

  > * {
    max-width: 400px;
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    gap: 24px;

    > .input,
    > .button {
      flex: 1;
    }
  }
`;

const OutlinedSearchInputField = styled(SearchInputField)`
  border: 1px solid;
  border-radius: 0.5rem;
`;

export const LocationNoPermissionStep: FC<{
  onSubmit: () => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext);

  return (
    <Container>
      <StyledMarkdown>
        {LocationNoPermissionPrimaryText(
          selectProductName(clientSideConfiguration),
          "about:blank"
        )}
      </StyledMarkdown>
      <footer className="footer">
        <OutlinedSearchInputField
          searchQuery="Berlin"
          onChange={() => {}}
          hidden={false}
          ariaRole="search"
        />
        <CallToActionButton className="button" onClick={onSubmit}>
          {LocationSearchContinueText}
        </CallToActionButton>
      </footer>
    </Container>
  );
};
