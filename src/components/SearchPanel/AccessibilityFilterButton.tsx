import * as React from 'react'
import styled, { css } from 'styled-components'
import { t } from 'ttag'

import { omit } from 'lodash'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/model/ac/Feature'
import colors from '../../lib/util/colors'
import CloseIcon from '../icons/actions/Close'
import Button from '../shared/Button'
import CombinedIcon from './CombinedIcon'

type Props = {
  className?: string;
  showCloseButton: boolean;
  accessibilityFilter: YesNoLimitedUnknown[];
  toiletFilter: YesNoUnknown[];
  caption: string;
  category: string;
  isMainCategory?: boolean;
  onFocus?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onBlur?: (event: React.FocusEvent<HTMLButtonElement>) => void;
  onKeyDown?: (event: React.KeyboardEvent<HTMLButtonElement>) => void;
  isActive: boolean;
};

export const Caption = styled.span`
  flex: 1;
  color: ${colors.darkSelectedColor};
`

function AccessibilityFilterButton(props: Props) {
  const {
    toiletFilter,
    accessibilityFilter,
    category,
    isMainCategory,
    showCloseButton,
    caption,
    isActive,
    className,
  } = props

  const router = useRouter()

  const query = {
    ...omit(router.query, 'q', 'wheelchair', 'toilet'),
  }
  if (!isActive) {
    if (accessibilityFilter.length > 0) {
      query.wheelchair = accessibilityFilter.map((t) => t.toString()).join(',')
    }
    if (toiletFilter.length > 0) {
      query.toilet = toiletFilter.map((t) => t.toString()).join(',')
    }
  }

  return (
    <Link
      href={{
        pathname: router.pathname,
        query,
      }}
      legacyBehavior
    >
      <Button
        className={className}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        onKeyDown={props.onKeyDown}
        tabIndex={0}
        aria-label={showCloseButton ? t`Remove ${caption} Filter` : caption}
      >
        <CombinedIcon
          {...{
            toiletFilter, accessibilityFilter, category, isMainCategory,
          }}
        />
        <Caption>{caption}</Caption>
        {showCloseButton && <CloseIcon className="close-icon" />}
      </Button>
    </Link>
  )
}

export default styled(AccessibilityFilterButton)`
  & {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: 10px 1em 10px 1.3em;
    min-height: 3rem;
    cursor: pointer;

    svg.icon {
      width: 21px;
      height: 21px;
    }

    ${CombinedIcon} {
      width: 70px;
    }

    ${(props) => props.isActive
      && css`
        background-color: ${colors.coldBackgroundColor};
      `};

    &:hover,
    &:focus {
      background-color: ${colors.linkBackgroundColorTransparent};
    }
  }
`
