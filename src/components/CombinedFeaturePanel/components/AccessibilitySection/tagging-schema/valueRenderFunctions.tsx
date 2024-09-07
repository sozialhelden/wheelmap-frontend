import React from 'react'
import { t } from 'ttag'
import StyledMarkdown from '../../../../shared/StyledMarkdown'
import DisplayedQuantity from '../tags/values/DisplayedQuantity'
import OpeningHoursValue from '../tags/values/OpeningHoursValue'
import { ValueRenderProps } from './ValueRenderProps'

export const valueRenderFunctions: Record<
  string, (props: ValueRenderProps) => React.ReactNode
> = {
  opening_hours: (props) => <OpeningHoursValue value={props.value} />,
  'opening_hours:(atm|covid19|drive_through|kitchen|lifeguard|office|pharmacy|reception|store|workshop)': (props) => <OpeningHoursValue value={props.value} />,
  step_height: (props) => <DisplayedQuantity value={props.value} defaultUnit="cm" />,
  entrance_width: (props) => <DisplayedQuantity value={props.value} defaultUnit="cm" />,
  width: (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  height: (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  depth: (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  colour: (props) => (
    <span
      lang="en"
      aria-label={props.value}
      style={{
        backgroundColor: props.value,
        borderRadius: '0.5rem',
        boxShadow: 'inset 0 0 1px rgba(0,0,0,.5), inset 0 2px 4px rgba(255, 255, 255, .2), 0 1px 10px rgba(0,0,0,.1)',
        width: '1rem',
        height: '1rem',
        lineHeight: '1rem',
        display: 'inline-block',
      }}
    />
  ),
  'power_supply:voltage': (props) => <DisplayedQuantity value={props.value} defaultUnit="V" />,
  'power_supply:current': (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  'power_supply:maxcurrent': (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  'power_supply:frequency': (props) => <DisplayedQuantity value={props.value} defaultUnit="Hz" />,
  'socket:([\w_]+)': (props) => <DisplayedQuantity value={props.value} defaultUnit="×" />,
  '(?:socket:([\w_]+):)?amperage': (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  '(?:socket:([\w_]+):)?current': (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  '(?:socket:([\w_]+):)?maxamperage': (props) => <DisplayedQuantity value={props.value} defaultUnit="A" />,
  '(?:socket:([\w_]+):)?voltage': (props) => <DisplayedQuantity value={props.value} defaultUnit="V" />,
  '(?:socket:([\w_]+):)?output': (props) => <DisplayedQuantity value={props.value} defaultUnit="W" />,
  'kerb:height': (props) => <DisplayedQuantity value={props.value} defaultUnit="m" />,
  '(?:([\w_]+):)?description(?:(\w\w))?': (props) => {
    const text = props.value
    const targetGroup = props.matches[1]
    const lang = props.matches[2]
    return <StyledMarkdown lang={lang}>{t`“${text}”`}</StyledMarkdown>
  },
}
