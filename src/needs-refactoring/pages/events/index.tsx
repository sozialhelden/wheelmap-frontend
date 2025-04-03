import MappingEventListPanel from "~/needs-refactoring/components/MappingEvents/MappingEventListPanel";
import { getLayout } from "~/components/layouts/DefaultLayout";

export default function Page() {
  return <MappingEventListPanel />;
}

Page.getLayout = getLayout;
