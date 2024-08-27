import { useMappingEvent } from '../fetchers/fetchMappingEvent'
import { useCurrentAppToken } from './AppContext'
import { useCurrentMappingEventId } from './MappingEventContext'

export function useCurrentMappingEvent() {
  const { data: _id } = useCurrentMappingEventId()
  const appToken = useCurrentAppToken()

  return useMappingEvent({ appToken, _id })
}
