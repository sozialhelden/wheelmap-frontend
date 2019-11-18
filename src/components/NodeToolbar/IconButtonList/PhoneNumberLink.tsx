import { t } from 'ttag';
import * as React from 'react';
import PhoneIcon from '../../icons/actions/Phone';
import { Feature, isWheelmapProperties } from '../../../lib/Feature';

type Props = {
  feature: Feature | null,
};

export default function PhoneNumberLink(props: Props) {
  const { feature } = props;
  const { properties } = feature || {};
  if (!properties) return null;

  let phoneNumber: string = null

  if (!isWheelmapProperties(properties)) {
    phoneNumber = properties.phoneNumber || properties.phone
  } else {
    phoneNumber = properties.phone;
  }

  if (typeof phoneNumber !== 'string') return null;

  return (
    <a className="phone-number link-button" href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}>
      <PhoneIcon />
      <span>{t`Call ${phoneNumber}`}</span>
    </a>
  );
}
