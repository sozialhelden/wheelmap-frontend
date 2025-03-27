import React, { type ReactNode } from "react";
import SearchAndFilterBar from "~/components/header/SearchAndFilterBar";
import { getLayout as getMapLayout } from "~/components/layouts/BaseMapLayout";

export function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <SearchAndFilterBar />
      {children}
    </>
  );
}

export const getLayout = (page: ReactNode) =>
  getMapLayout(<DefaultLayout>{page}</DefaultLayout>);
