import type { Metadata } from "next";
import { ReadonlyURLSearchParams } from "next/navigation";
import { List } from "~/app/(app)/(map)/_components/List";
import { SidebarLayout } from "~/app/(app)/(map)/_components/SidebarLayout";
import { getAppStateFromSearchParams } from "~/modules/app-state/utils/app-state";
import { getCategoryFilterState } from "~/modules/categories/utils/state";
import { getDefaultMetadata } from "~/utils/metadata";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<Record<string, string>>;
}): Promise<Metadata> {
  const meta = await getDefaultMetadata();

  const { categoryProperties, isFilteringActive } = getCategoryFilterState(
    getAppStateFromSearchParams(
      new ReadonlyURLSearchParams(await searchParams),
    ),
  );

  if (isFilteringActive) {
    meta.title = categoryProperties?.name();
  }

  return meta;
}

/**
 * Main index page: `/`
 */
export default function Page() {
  return (
    <SidebarLayout>
      <List />
    </SidebarLayout>
  );
}
