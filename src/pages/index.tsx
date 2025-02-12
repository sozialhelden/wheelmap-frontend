import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { SearchBar } from "~/components/SearchBar";
import { CategoryFilter } from "~/domains/categories/components/CategoryFilter";
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

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return (
    <Toolbar>
      <SearchBar />
      <CategoryFilter />
    </Toolbar>
  );
}

Page.getLayout = getLayout;
