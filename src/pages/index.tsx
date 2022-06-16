import { useRouter } from "next/router";
import { useEffect } from "react";
import Layout from "../components/App/Layout";
import { isFirstStart } from "../lib/savedState";

export default function MainIndexPage() {
  const router = useRouter();

  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return <Layout></Layout>;
}
