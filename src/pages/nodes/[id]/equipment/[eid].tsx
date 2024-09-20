import { useEffect } from 'react'
import { useAppStateAwareRouter } from '../../../../lib/util/useAppStateAwareRouter'

function EquipmentInfoPage() {
  const { replace, query: { id, eid } } = useAppStateAwareRouter()

  useEffect(() => {
    // TODO push parent place in history state
    replace(`/ac:EquipmentInfo/${eid}`)
  }, [replace, eid, id])
}

export default EquipmentInfoPage
