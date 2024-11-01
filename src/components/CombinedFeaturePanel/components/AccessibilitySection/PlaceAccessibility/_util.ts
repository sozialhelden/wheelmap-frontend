import { Quantity } from '@sozialhelden/a11yjson'
import { t } from 'ttag'

export const quantityToString = (quantity: Quantity | string) => (typeof quantity === 'string'
  ? undefined
  : `${quantity.value}${quantity.value}`)

export const YesNoUnknownText = (
  value: boolean | undefined,
  {
    yes = t`Yes`,
    no = t`No`,
    unknown = t`Unknown`,
  }: { yes?: string, no?: string, unknown?: string },
) => {
  if (value === undefined) {
    return unknown
  }
  return value ? yes : no
}