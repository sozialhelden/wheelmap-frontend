import { useRouter } from "next/router";
import React, { ReactElement } from "react";
import Layout from "../../components/App/Layout";
import OnboardingDialog from "../../components/Onboarding/OnboardingDialog";
import { saveState } from "../../lib/savedState";

export default function Page() {
  const router = useRouter();
  const handleClose = React.useCallback(() => {
    saveState({ onboardingCompleted: "true" });
    router.push("/");
  }, []);

  return <OnboardingDialog onClose={handleClose} />;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};