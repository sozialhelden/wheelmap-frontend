import { useRouter } from 'next/router';
import React from 'react';
import Layout from '../../components/App/Layout';
import OnboardingDialog from '../../components/Onboarding/OnboardingDialog';
import { saveState } from '../../lib/savedState';

const OnboardingPage = () => {
  const router = useRouter();
  const handleClose = React.useCallback(() => {
    saveState({ onboardingCompleted: 'true' });
    router.push('/');
  }, []);

  return (
    <Layout>
      <OnboardingDialog onClose={handleClose} />
    </Layout>
  );
};

export default OnboardingPage;
