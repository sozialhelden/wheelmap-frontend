import styled from 'styled-components'

export const LocationContainer = styled.div`
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
    max-width: 400px;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-self: center;
    gap: 24px;
  }
`
