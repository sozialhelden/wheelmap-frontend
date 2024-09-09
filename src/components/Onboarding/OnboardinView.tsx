import { useRouter } from 'next/router'
import React from 'react'
import OnboardingDialog from './OnboardingDialog'
import { saveState } from '../../lib/util/savedState'
import { KomootPhotonResultFeature } from '../../lib/fetchers/fetchPlacesOnKomootPhoton'

export default function Page() {
  const router = useRouter()
  const handleClose = React.useCallback((location?: KomootPhotonResultFeature) => {
    saveState({ onboardingCompleted: 'true' })
    const query = location ? `?lat=${location.geometry.coordinates[1]}&lon=${location.geometry.coordinates[0]}&zoom=11` : ''
    router.push(`/${query}`)
  }, [router])

  return <OnboardingDialog onClose={handleClose} />
}
