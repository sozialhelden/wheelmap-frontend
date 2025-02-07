import { getLayout } from "../../components/App/MapLayout";
import MappingEventListPanel from "../../components/MappingEvents/MappingEventListPanel";

export default function Page() {
  return <MappingEventListPanel />;
}

Page.getLayout = getLayout;
