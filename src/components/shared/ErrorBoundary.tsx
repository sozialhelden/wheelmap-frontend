import React, {
  Component, ComponentType, ElementType, ReactNode,
} from 'react'
import styled from 'styled-components'
import { t } from 'ttag'

import Link from 'next/link'
import colors from '../../lib/util/colors'
import { log } from '../../lib/util/logger'

type Props = {
  className?: string;
  children?: ReactNode;
};

type State = {
  hasError: boolean;
  error?: Error;
  errorInfo?: any;
};

class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props)

    this.state = { hasError: false }
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true }
  }

  componentDidCatch(error: Error, errorInfo: any) {
    this.setState({ hasError: true, error, errorInfo })

    log.error(error, errorInfo)
  }

  render() {
    const { hasError, error, errorInfo } = this.state

    if (hasError) {
      const { className } = this.props

      // translator: Shown as header text on the error page.
      const errorText = t`Error`

      // translator: Shown as apology text / description on the error page.
      const apologyText = t`Sorry, that should not have happened!`

      // translator: Shown on the error page.
      const returnHomeButtonCaption = t`Return home`

      return (
        <div
          className={className}
          aria-describedby="wheelmap-error-text wheelmap-apology-text"
        >
          <h1 id="wheelmap-error-text">{errorText}</h1>

          <p>{apologyText}</p>

          <ErrorDetail>
            {error && error.message && ` — ${error.message}`}
          </ErrorDetail>

          <Link href="/" className="button-cta-close focus-visible">

            {returnHomeButtonCaption}

          </Link>
        </div>
      )
    }

    return this.props.children
  }
}

export const withErrorBoundary = (WrappedComponent: React.FC) => {
  const Wrapper = ({ ...props }) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  )
  return Wrapper
}

const ErrorDetail = styled.p`
  font-family: monospace;
  color: rgba(0, 0, 0, 0.6);
  font-size: 0.8em;
`

export default styled(ErrorBoundary)`
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 30%;
  padding-bottom: 35%;
  height: 100%;
  max-width: 100%;
  max-height: 100%;
  overflow: hidden;
  background-color: white;
  color: black;

  h1 {
    font-size: 1.25em;
  }

  h1,
  p {
    margin: 0;

    & + p {
      margin-top: 1em;
    }
  }

  .button-cta-close {
    display: inline-flex;
    border: none;
    outline: none;
    color: white;
    background-color: ${colors.linkColor};
    font-size: 1em;
    line-height: 1;
    padding: 0.5em 0.75em;
    margin-top: 2em;
    cursor: pointer;

    &.focus-visible {
      box-shadow: 0px 0px 0px 4px ${colors.selectedColorLight};
      transition: box-shadow 0.2s;
    }
  }
`
