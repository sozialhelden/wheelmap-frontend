/* eslint-disable @stylistic/js/max-len */
/* eslint-disable max-len */
import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'
import { YesNoUnknownText } from './_util'

export const Payment: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.payment) {
    return null
  }

  const { payment } = accessibility
  const keys = Object.keys(payment) as (keyof typeof payment)[]
  if (keys.length <= 0) {
    return null
  }

  return (
    <li>
      Payment:
      {YesNoUnknownText(payment.acceptsDebitCards, { yes: 'accepts debit cards; ', no: 'no debit cards; ' })}
      {YesNoUnknownText(payment.acceptsCreditCards, { yes: 'accepts credit cards; ', no: 'no credit cards; ' })}
      {YesNoUnknownText(payment.acceptsPaymentByMobilePhone, { yes: 'accepts pay by mobile phone; ', no: 'does not accept pay by mobile phone;' })}
      {YesNoUnknownText(payment.acceptsBills, { yes: 'accepts bills; ', no: 'does not accept bills; ' })}
      {YesNoUnknownText(payment.acceptsCoins, { yes: 'accepts coins; ', no: 'does not accept coins; ' })}
      {YesNoUnknownText(payment.hasPortablePaymentSystem, { yes: 'has a portable payment system; ', no: 'has no portable payment system; ' })}
    </li>
  )
}
