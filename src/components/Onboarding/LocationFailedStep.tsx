import styled from 'styled-components'
import { AppContext } from '../../lib/context/AppContext'
import StyledMarkdown from '../shared/StyledMarkdown'
import { LocationFailedStepPrimaryText, selectProductName } from './language'
import { LocationSearch } from './components/LocationSearch'
import type { PhotonResultFeature } from '../../lib/fetchers/fetchPhotonFeatures'
import { LocationContainer } from './components/LocationContainer'
import { Flex } from '@radix-ui/themes'
import { type FC, useContext } from 'react'

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
      <Flex gap="3" mt="4" justify="end">
        <LocationSearch onUserSelection={onSubmit} />
      </Flex>
    </Container>
  )
}
