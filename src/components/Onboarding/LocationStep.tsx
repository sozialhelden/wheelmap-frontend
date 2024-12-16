import {
  FC, useCallback, useEffect, useState,
} from 'react'
import styled from 'styled-components'
import { cx } from '../../lib/util/cx'
import { CallToActionButton, SecondaryButton } from '../shared/Button'
import StyledMarkdown from '../shared/StyledMarkdown'
import {
  DenyLocationPermissionText,
  GrantLocationPermissionText,
  LocationStepAdditionalHint,
  LocationStepPrimaryText,
} from './language'
import { getLocationSettingsUrl } from '../../lib/goToLocationSettings'
import { Box, Button, Flex, Spinner } from '@radix-ui/themes'

type Stage = 'idle' | 'acquiring' | 'failed-not-exited'

// oeuf, there are many exit points that may be consolidated:
// permission denied: ok, they denied
// position unavailable: stop being in a tunnel
// timeout: "Geolocation information was not obtained in the allowed time."
export const LocationStep: FC<{
  onAccept: () => unknown;
  onRejected: () => unknown;
  onFailed: () => unknown;
  onGeneralError: (error: GeolocationPositionError) => unknown;
  maxRetries?: number;
}> = ({
  onAccept, onFailed, onGeneralError, onRejected, maxRetries = 2,
}) => {
  const [stage, setStage] = useState({ stage: 'idle' as Stage, retries: 0 })

  useEffect(() => {
    if (!navigator.geolocation) {
      // unsupported feature, default disabled?
      onFailed()
    }
  }, [onFailed])

  // failing to get the permission puts the UI in a failure state, but does not
  // exit. If the user pressed okay, but then denied from the browser
  // we may as well retry and give enough insights
  const requestLocationPermission = useCallback(() => {
    setStage({ ...stage, stage: 'acquiring' })

    navigator.geolocation.getCurrentPosition(onAccept, (error) => {
      if (error.code === error.POSITION_UNAVAILABLE) {
        onAccept()
        return
      }
      if (
        error.code === error.PERMISSION_DENIED
        || error.code === error.TIMEOUT
      ) {
        if (stage.retries >= maxRetries) {
          onFailed()
          return
        }
        setStage({ stage: 'failed-not-exited', retries: stage.retries + 1 })
        return
      }

      onGeneralError(error)
    })
  }, [onAccept, stage, onGeneralError, maxRetries, onFailed])

  const isAcquiring = stage.stage === 'acquiring'
  const [url] = getLocationSettingsUrl()

  // when retries fail, show an additional hint
  const primaryText = `${LocationStepPrimaryText}${
    stage.retries > 0 ? `\n\n${LocationStepAdditionalHint(url)}` : ''
  }`

  return (
    <Box>
      <StyledMarkdown>{primaryText}</StyledMarkdown>

      <Flex gap="3" mt="4" justify="end">
        <Button onClick={onRejected} size="3" variant="soft">
          {DenyLocationPermissionText}
        </Button>
        <Button
          size="3"
          onClick={requestLocationPermission}
          className={cx('accept', isAcquiring && 'active')}
        >
          <span className="text">{GrantLocationPermissionText}</span>
          {stage.stage === 'acquiring' && <Spinner />}
        </Button>
      </Flex>
    </Box>
  );
};
