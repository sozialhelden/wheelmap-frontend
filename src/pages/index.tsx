import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { FilterBar } from "~/components/FilterBar";
import { SearchBar } from "~/components/SearchBar";
import { isFirstStart } from "~/lib/util/savedState";

const Toolbar = styled.div`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  @media (min-width: 1025px) {
    display: flex;
    justify-content: start;
    align-items: center;
  }
`;

export default function Page() {
  const router = useRouter();

  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, [router]);

  return (
    <Toolbar>
      <SearchBar />
      <FilterBar />
    </Toolbar>
  );
}

Page.getLayout = getLayout;
