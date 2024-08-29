import { FC, useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../lib/context/AppContext'
import StyledMarkdown from '../shared/StyledMarkdown'
import {
  LocationFailedStepPrimaryText,
  selectProductName,
} from './language'
import { LocationSearch } from './components/LocationSearch'

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
    align-self: center;
    gap: 24px;
    max-width: 400px;

    > .input,
    > .button {
      flex: 1;
    }
  }
`

export const LocationFailedStep: FC<{
  onSubmit: () => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext)

  return (
    <Container>
      <StyledMarkdown>
        {LocationFailedStepPrimaryText(
          selectProductName(clientSideConfiguration),
        )}
      </StyledMarkdown>
      <footer className="footer">
        <LocationSearch onUserSelection={onSubmit} />
      </footer>
    </Container>
  )
}
