import { CaretLeftIcon } from "@radix-ui/react-icons";
import { Button } from "@radix-ui/themes";
import { useRouter } from "next/router";
import React, { useEffect } from "react";
import styled from "styled-components";
import { getLayout } from "~/components/App/MapLayout";
import { CategoryFilter } from "~/domains/categories/components/CategoryFilter";
import { Search } from "~/domains/search/components/Search";
import { useSidebarContext } from "~/domains/sidebar/SidebarContext.ts";
import { isFirstStart } from "~/lib/util/savedState";

const Toolbar = styled.div`
  position: fixed;
  top: 4rem;
  left: 0;
  right: 0;
  @media (min-width: 1025px) {
    display: flex;  
    gap: var(--space-3);
    justify-content: start;
    align-items: center;
  }
`;

export default function Page() {
  const router = useRouter();
  const { toggle } = useSidebarContext();

  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (isFirstStart()) {
      router.replace("/onboarding");
    }
  }, []);

  return (
    <Toolbar>
      <Search />
      <Button
        size="3"
        variant="surface"
        color="gray"
        highContrast={true}
        onClick={toggle}
      >
        <CaretLeftIcon />
      </Button>

      <CategoryFilter />
    </Toolbar>
  );
}

Page.getLayout = getLayout;
