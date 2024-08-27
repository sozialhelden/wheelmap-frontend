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

export default function DisplayedQuantity({ value, defaultUnit }: { value: string; defaultUnit: string }) {
  const quantity = React.useMemo(() => parseQuantity(value), [value])
  if (typeof quantity === 'string') {
    return <Quantity>{quantity}</Quantity>
  }
  const { unit, value: quantityValue } = quantity
  return (
    <Quantity>
      <Value>{quantityValue}</Value>
    &thinsp;
      <Unit>{unit || defaultUnit}</Unit>
    </Quantity>
  )
}
