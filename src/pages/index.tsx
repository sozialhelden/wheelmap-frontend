import { useRouter } from "next/router";
import { ReactElement, useEffect } from "react";
import Layout from "../components/App/Layout";
import { isFirstStart } from "../lib/savedState";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return <></>;
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Layout>{page}</Layout>;
};
