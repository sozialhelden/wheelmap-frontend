/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable @stylistic/js/indent */
/* eslint-disable no-fallthrough */
import {
  Accessibility, AccessType, Length, Restroom as RestroomJson,
} from '@sozialhelden/a11yjson'
import { FC } from 'react'
import styled from 'styled-components'
import { t } from 'ttag'
import colors from '../../../../../lib/util/colors'
import { YesNoUnknownText } from './_util'
import { ListEntryYesNoUnknown } from './_ListEntryYesNoUnknown'
import { FoldablePre } from './_FoldablePre'

const StyledListEntry = styled.li`
    // just an indicator that this is a rendering part
    border-left: 2px ${colors.textColorBrighter} solid;
    // light segmentation
    margin-bottom: 4px;
    padding-left: 4px;

    &.warn {
      border-left-color: ${colors.warningColorDarker};
    }

    &.important {
      border-left-color: ${colors.negativeColorDarker};
    }

    &.good {
      border-left-color: ${colors.positiveColorDarker};
    }
`

const Access: FC<{ accessType: AccessType | undefined }> = ({ accessType }) => {
  switch (accessType) {
    case 'customers':
      return <StyledListEntry className="warn">{t`Only available for customers!`}</StyledListEntry>
    case 'emergency':
      return <StyledListEntry className="warn">{t`Access is only granted in emergencies`}</StyledListEntry>
    case 'employees':
      return <StyledListEntry className="important">{t`Access is only permitted for employees`}</StyledListEntry>
    case 'no':
      return <StyledListEntry className="important">{t`Public access is prohibited on foot and for any vehicle, for every type of person`}</StyledListEntry>
    case 'permit':
      return <StyledListEntry className="warn">{t`Open only to people who have obtained a  permit granting them access, but permit is ordinarily granted`}</StyledListEntry>
    case 'private':
      return <StyledListEntry className="warn">{t`Public access is not allowed. Access is granted with individual permission only`}</StyledListEntry>
    case 'residents':
      return <StyledListEntry className="warn">{t`Access only for residents`}</StyledListEntry>
    case 'public':
    case 'yes':
      return <StyledListEntry className="good">{t`The public has an official, legally-enshrined right of access; i.e., it's a right of way.`}</StyledListEntry>
    case 'delivery':
    case 'disabled':
    case undefined:
    case 'designated':
    case 'permissive':
    default:
      return null
  }
}

const IsWheelchairAccessible: FC<{ isAccessibleWithWheelchair: boolean | undefined }> = ({ isAccessibleWithWheelchair }) => <ListEntryYesNoUnknown yes={t`👍 Restroom is wheelchair accessible`} no="👎 Restroom is not wheelchair accessible" value={isAccessibleWithWheelchair} />

const TurningSpaceInside : FC<{ turningSpaceInside: Length | undefined }> = ({ turningSpaceInside }) => {
  if (!turningSpaceInside) {
    return null
  }
  if (typeof turningSpaceInside === 'string') {
    return <li>{turningSpaceInside}</li>
  }

  return (
    <li>
      Turning space inside is
      {` ${turningSpaceInside.rawValue}`}
    </li>
  )
}

const Restroom: FC<{ restroom: RestroomJson }> = ({ restroom }) => {
  const wheelchairAccessibility = YesNoUnknownText(restroom.isAccessibleWithWheelchair, { yes: 'good', no: 'warn', unknown: undefined })

  return (
    <li className={wheelchairAccessibility}>
      <ul>
        {restroom.description && <h3>{`${restroom.description}`}</h3>}
        <IsWheelchairAccessible isAccessibleWithWheelchair={restroom.isAccessibleWithWheelchair} />
        <Access accessType={restroom.access?.[0]} />
        <TurningSpaceInside turningSpaceInside={restroom.turningSpaceInside} />
        <FoldablePre>{JSON.stringify(restroom, undefined, 2)}</FoldablePre>
      </ul>
    </li>
  )
}

export const Restrooms: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.restrooms) {
    return null
  }

  const { restrooms } = accessibility

  if (restrooms.length <= 0) {
    return null
  }
  return (
    <>
      <h2>Restrooms</h2>
      {/* I'm a mere mortal, may the chores of hard labor fall unto you and may you implement this yourself */}
      {/* eslint-disable-next-line react/no-array-index-key */}
      {restrooms.map((x, i) => (<Restroom key={i} restroom={x} />))}
    </>
  )
}
