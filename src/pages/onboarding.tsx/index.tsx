import React from 'react';
import OnboardingDialog from '../../components/Onboarding/OnboardingDialog';
import { saveState } from '../../lib/savedState';

const OnboardingPage = () => {
  const handleClose = React.useCallback(() => {
    saveState({ onboardingCompleted: 'true' });
  }, []);

  return <OnboardingDialog onClose={handleClose} />;
};

export default OnboardingPage;
