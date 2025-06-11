import { getLayout } from "~/layouts/DefaultLayout";
import MappingEventListPanel from "~/needs-refactoring/components/MappingEvents/MappingEventListPanel";

export default function Page() {
  return <MappingEventListPanel />;
}

Page.getLayout = getLayout;
