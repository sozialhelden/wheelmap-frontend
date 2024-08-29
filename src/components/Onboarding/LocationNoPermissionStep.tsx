import { FC } from "react";
import styled from "styled-components";
import SearchInputField from "../SearchPanel/SearchInputField";
import { CallToActionButton } from "../shared/Button";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;

  .title {
    @media (min-width: 414px) {
      font-size: 1.25rem;
    }
    @media (min-height: 414px) {
      font-size: 1.25rem;
    }
  }

  .details {
    display: flex;
    flex-direction: column;
    > .explainer {
    }
  }

  .footer {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    gap: 24px;
    max-width: 400px;

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
  return (
    <Container>
      <header className="title">No Problem!</header>
      <section className="details">
        <p>
          If you change your mind at any time, you can grant location
          permissions for Wheelmap at any time through{" "}
          <a href="about:blank">your devices&apos; location setting</a>.
        </p>
        <p>Don&apos;t worry, you can still use all features of Wheelmap.</p>
        <p>Do you want to start with in the center of a city instead?</p>
      </section>
      <footer className="footer">
        <OutlinedSearchInputField
          searchQuery="Berlin"
          onChange={() => {}}
          hidden={false}
          ariaRole="search"
        />
        <CallToActionButton className="button" onClick={onSubmit}>
          Continue
        </CallToActionButton>
      </footer>
    </Container>
  );
};
