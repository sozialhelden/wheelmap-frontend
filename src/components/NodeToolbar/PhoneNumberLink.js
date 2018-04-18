// @flow

import { t } from 'c-3po';
import * as React from 'react';

export default function PhoneNumberLink({ phoneNumber }: { phoneNumber: string }) {
  if (window.navigator.userAgent.match(/iPhone/)) {
    return (<span className="phone-number">
      {phoneNumber}
    </span>);
  }
  return (<a className="phone-number link-button" href={`tel:${phoneNumber.replace(/[^\d+]/g, '')}`}>
    {t`Call ${phoneNumber}`}
  </a>);
}
