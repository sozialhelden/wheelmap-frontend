import React, { type ReactNode } from "react";
import ToolBar from "~/components/layout/ToolBar";
import { getLayout as getMapLayout } from "~/layouts/BaseMapLayout";

export function DefaultLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      <ToolBar />
      {children}
    </>
  );
}

export const getLayout = (page: ReactNode) =>
  getMapLayout(<DefaultLayout>{page}</DefaultLayout>);
