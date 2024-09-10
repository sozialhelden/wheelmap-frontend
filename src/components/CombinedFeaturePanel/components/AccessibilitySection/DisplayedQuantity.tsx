import { parseQuantity } from '@sozialhelden/a11yjson'
import React from 'react'
import styled from 'styled-components'

const Quantity = styled.div.attrs({ className: 'quantity' })`
  text-align: right;
`

const Value = styled.span.attrs({ className: 'value' })`

  font-weight: 500;
`

const Unit = styled.span.attrs({ className: 'unit' })`

`

export default function DisplayedQuantity({ value, defaultUnit, prefix, suffix }: { value: string | number; defaultUnit: string, prefix?: React.ReactNode, suffix?: React.ReactNode }) {
  const quantity = React.useMemo(
    () => (typeof value === 'string' ? parseQuantity(value) : value),
    [value],
  )
  if (typeof quantity === 'string' || typeof quantity === 'number') {
    return <Quantity>{prefix}{quantity} {defaultUnit}{suffix}</Quantity>
  }
  const { unit, value: quantityValue } = quantity
  return (
    <Quantity>
      {prefix}
      <Value>{quantityValue}</Value>
    &thinsp;
      <Unit>{unit || defaultUnit}</Unit>
      {suffix}
    </Quantity>
  )
}
