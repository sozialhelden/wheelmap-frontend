import { Accessibility } from '@sozialhelden/a11yjson'
import { FC } from 'react'

export const ServiceContact: FC<{ accessibility: Accessibility | undefined; }> = ({ accessibility }) => {
  if (!accessibility?.serviceContact) {
    return null
  }

  const { serviceContact } = accessibility
  return <li>{`${serviceContact}`}</li>
}
