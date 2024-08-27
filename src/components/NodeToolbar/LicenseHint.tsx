import styled from 'styled-components'
import * as React from 'react'

type Props = {
  className?: string,
  license: any,
  source: any,
};

class LicenseHint extends React.PureComponent<Props> {
  props: Props

  render() {
    const { source, license } = this.props
    if (!source || !license) {
      return null
    }

    let licenseLinkOrName = license.shortName
    if (typeof license.websiteURL === 'string') {
      licenseLinkOrName = license.shortName === '?' ? null : (
        <a href={license.websiteURL} target="_blank" rel="noopener noreferrer">
          {license.shortName}
        </a>
      )
    }
    let sourceLinkOrName = source.name
    if (typeof source.originWebsiteURL === 'string') {
      sourceLinkOrName = (
        <a href={source.originWebsiteURL} target="_blank" rel="noopener noreferrer">
          {source.name}
        </a>
      )
    }
    return (
      <li className={this.props.className}>
        {sourceLinkOrName}
        {' '}
        {licenseLinkOrName ? (
          <span>
            (
            {licenseLinkOrName}
            )
          </span>
        ) : null}
      </li>
    )
  }
}

const StyledLicenseHint = styled(LicenseHint)``

export default StyledLicenseHint
