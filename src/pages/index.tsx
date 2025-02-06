import { useRouter } from "next/router";
import React, { useEffect, ReactElement } from "react";
import { getLayout } from "../components/App/MapLayout";
import { SearchButtonOrInput } from "../components/SearchPanel/SearchButtonOrInput";
import { isFirstStart } from "../lib/util/savedState";

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, [router]);

  return <SearchButtonOrInput />;
}

Page.getLayout = getLayout;
