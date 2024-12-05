import { FC, useContext } from 'react'
import styled from 'styled-components'
import { AppContext } from '../../lib/context/AppContext'
import StyledMarkdown from '../shared/StyledMarkdown'
import { LocationFailedStepPrimaryText, selectProductName } from './language'
import { LocationSearch } from './components/LocationSearch'
import type { PhotonResultFeature } from '../../lib/fetchers/fetchPhotonFeatures'
import { LocationContainer } from './components/LocationContainer'

const Container = styled(LocationContainer)`
  .footer {
    > .input,
    > .button {
      flex: 1;
    }
  }
`

export const LocationFailedStep: FC<{
  onSubmit: (location?: PhotonResultFeature) => unknown;
}> = ({ onSubmit }) => {
  const { clientSideConfiguration } = useContext(AppContext) ?? { }

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
