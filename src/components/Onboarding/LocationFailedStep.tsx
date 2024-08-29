import { FC } from "react";
import styled from "styled-components";
import { PrimaryButton } from "../shared/Button";

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
    justify-content: space-between;
    gap: 24px;

    > .input,
    > .button {
      flex: 1;
    }
  }
`;

export const LocationFailedStep: FC<{}> = ({}) => {
  return (
    <Container>
      <header className="title">That did not work!</header>
      <section className="details">
        <p>Don&apos;t worry, you can still use all features of Wheelmap.</p>
        <p>Do you want to start with in the center of a city instead?</p>
      </section>
      <footer className="footer">
        <input className="input" placeholder="City Name" />{" "}
        <PrimaryButton className="button">Continue</PrimaryButton>
      </footer>
    </Container>
  );
};
