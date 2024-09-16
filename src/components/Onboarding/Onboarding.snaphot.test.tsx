/// an jest snapshot test for the Onboarding component

import React from 'react'
import renderer from 'react-test-renderer'
import OnboardingDialog from './OnboardingDialog'
import { log } from '../../lib/util/logger'

const handleClose = React.useCallback(() => {
  log.log('calling handleClose in OnboardingDialog snapshot test')
}, [])

it('renders correctly', () => {
  const tree = renderer
    .create(<OnboardingDialog onClose={handleClose} />)
    .toJSON()
  expect(tree).toMatchSnapshot()
})
