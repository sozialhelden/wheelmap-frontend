// @flow

import { t } from 'c-3po';
import * as React from 'react';

export default function PhoneNumberLink({ phoneNumber }: { phoneNumber: string }) {
  return (<a className="phone-number link-button" href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}>
    {t`Call ${phoneNumber}`}
  </a>);
}
