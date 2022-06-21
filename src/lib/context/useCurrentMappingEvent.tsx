import { useMappingEvent } from "../fetchers/fetchMappingEvent";
import { useCurrentApp } from "./AppContext";
import { useCurrentMappingEventId } from "./MappingEventContext";

export function useCurrentMappingEvent() {
  const { data: _id } = useCurrentMappingEventId();
  const { tokenString: appToken } = useCurrentApp();

  return useMappingEvent({ appToken, _id });
}
