import styled from 'styled-components';

export default styled.div`
  display: flex;
  max-width: 600px;
  margin-top: 3rem;
  margin-right: auto;
  margin-bottom: 0;
  margin-left: auto;
  justify-content: space-between;

  > section {
    width: 42%;
  }

  > div {
    width: 42%;
  }

  @media (max-width: 512px) {
    flex-direction: column;

    > section {
      width: 100%;
    }

    > div {
      width: 100%;
    }
  }
`;
