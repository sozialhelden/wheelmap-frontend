/// an jest snapshot test for the Onboarding component

import React from 'react';
import renderer from 'react-test-renderer';
import OnboardingDialog from './OnboardingDialog';

const handleClose = React.useCallback(() => {
  console.log('calling handleClose in OnboardingDialog snapshot test');
}, []);

it('renders correctly', () => {
  const tree = renderer
    .create(<OnboardingDialog onClose={handleClose} />)
    .toJSON();
  expect(tree).toMatchSnapshot();
});
