import styled from 'styled-components'
import { t } from 'ttag'

import { YesNoLimitedUnknown, YesNoUnknown } from '../../lib/model/ac/Feature'
import { isAccessibilityFiltered } from '../../lib/model/ac/filterAccessibility'
import colors from '../../lib/util/colors'
import CloseIcon from '../icons/actions/Close'
import IconButton, { Caption, Circle } from '../shared/IconButton'
import CombinedIcon from './CombinedIcon'
import { AppStateLink } from '../App/AppStateLink'

type Props = {
  name: string;
  category: string;
  showCloseButton: boolean;
  hasCircle?: boolean;
  accessibilityFilter?: YesNoLimitedUnknown[];
  toiletFilter?: YesNoUnknown[];
  onClick?: (category: string) => void;
  onFocus?: () => void;
  onBlur?: () => void;
  className?: string;
  isMainCategory: boolean;
}

export const StyledCategoryIconButton = styled(IconButton)`
  figure {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  ${Circle} {
    background-color: ${colors.tonedDownSelectedColor};
    margin: 2.5px;

    svg.icon {
      g,
      path,
      circle,
      rect {
        fill: white;
      }
    }
  }

  svg.icon {
    width: 21px;
    height: 21px;
  }

  &.active {
    background-color: ${colors.coldBackgroundColor};

    ${Circle} {
      background-color: ${colors.selectedColor};
    }
  }

  &:hover,
  &:focus {
    background-color: ${colors.linkBackgroundColorTransparent};

    ${Circle} {
      background-color: ${colors.halfTonedDownSelectedColor};
    }

    &.active {
      ${Circle} {
        background-color: ${colors.tonedDownSelectedColor};
      }
    }
  }
    
  &[data-show-close-button='false'] {
      flex-direction: column;

      ${CombinedIcon} {
          justify-content: center;
      }

      ${Caption} {
          font-size: 0.8em;
          margin-top: 0.5em;
          color: ${colors.darkSelectedColor};
      }
  }

  &[data-show-close-button='true'] {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      padding: 0 1em 0 1.3em;
      min-height: 3rem;

      flex: 1;

      ${CombinedIcon} {
          width: 70px;
      }

      ${Caption} {
          flex: 1;
          justify-content: flex-start;
          display: flex;
          color: ${colors.darkSelectedColor};
      }
  }
`

export default function CategoryButton(props: Props) {
  const {
    category,
    isMainCategory,
    accessibilityFilter,
    toiletFilter,
    showCloseButton,
    className,
  } = props

  let shownAccessibilities = accessibilityFilter
  if (showCloseButton || !isAccessibilityFiltered(accessibilityFilter)) {
    shownAccessibilities = []
  }

  const icon = (
    <CombinedIcon
      accessibilityFilter={shownAccessibilities}
      toiletFilter={toiletFilter}
      category={category || 'undefined'}
      isMainCategory={isMainCategory}
      aria-hidden
    />
  )

  return (
    <AppStateLink
      href={{
        query: { category: showCloseButton ? null : category },
      }}
      onClick={props.onClick ? (e) => { e.preventDefault(); props.onClick?.(category) } : undefined}
    >
      <StyledCategoryIconButton
        aria-label={
          showCloseButton ? t`Remove ${props.name} Filter` : props.name
        }
        className={className}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        isHorizontal={showCloseButton}
        caption={props.name}
        hasCircle={props.hasCircle}
        data-show-close-button={showCloseButton}
      >
        {icon}
        {showCloseButton && <CloseIcon style={{ order: 1 }} />}
      </StyledCategoryIconButton>
    </AppStateLink>
  )
}
