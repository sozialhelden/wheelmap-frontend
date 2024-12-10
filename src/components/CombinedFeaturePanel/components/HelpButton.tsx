import {
  HotkeysContext,
} from '@blueprintjs/core'
import { QuestionMarkIcon } from '@radix-ui/react-icons'
import { Button, IconButton } from '@radix-ui/themes'
import React from 'react'
import styled from 'styled-components'

export default function HelpButton({ className }: { className?: string }) {
  const [, dispatch] = React.useContext(HotkeysContext)
  const openHelp = React.useCallback(() => {
    dispatch({ type: 'OPEN_DIALOG' })
  }, [dispatch])
  return (
    <IconButton
      onClick={openHelp}
      className={className}
      variant="solid"
    >
      <QuestionMarkIcon />
    </IconButton>
  )
}

export const FixedHelpButton = styled(HelpButton)`
  position: fixed;
  right: 1rem;
  bottom: 2rem;
  borderRadius: 50%;
  fontSize: 1rem;
  zIndex: 10;
`
