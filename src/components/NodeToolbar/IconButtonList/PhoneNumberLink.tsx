import { t } from 'ttag';
import * as React from 'react';
import PhoneIcon from '../../icons/actions/Phone';

type Props = {
  feature: Feature | null;
};

export default function PhoneNumberLink(props: Props) {
  const { feature } = props;
  const { properties } = feature || {};
  if (!properties) return null;

  const { phoneNumber } = properties;
  if (typeof phoneNumber !== 'string') return null;

  return (
    <a className="phone-number link-button" href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}>
      <PhoneIcon />
      <span>{t`Call ${phoneNumber}`}</span>
    </a>
  );
}
