import { useMappingEvent } from "../fetchers/ac/refactor-this/fetchMappingEvent";
import { useCurrentMappingEventId } from "./MappingEventContext";

export function useCurrentMappingEvent() {
  const { data: _id } = useCurrentMappingEventId();
  return _id ? useMappingEvent(_id) : { data: undefined, isValidating: false };
}
