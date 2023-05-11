import * as React from 'react';
import opening_hours, { nominatim_object } from 'opening_hours';
import { t } from 'ttag';
import StyledMarkdown from '../../../../../shared/StyledMarkdown';
import { DateTime } from "luxon";
import FeatureContext from '../../../FeatureContext';
import { isOSMFeature } from '../../../../../../lib/model/shared/AnyFeature';


// helper function
function getReadableState(oh: opening_hours) {
  const outputs = [];
  const comment = oh.getComment();
  if (oh.getUnknown()) {
    const maybeOpen = t`Maybe open`;
    const maybeOpenBut = t`Maybe open (“${comment}”)`;
    outputs.push(comment ? maybeOpenBut : maybeOpen);
  } else {
    const state = oh.getState();
    outputs.push(state ? t`Now open.` : t`Now closed.`);
    if (comment) {
      outputs.push(t`(“${comment}”)`);
    }
  }
  return outputs;
}


export default function OpeningHoursValue(props: { value: string }) {
  // https://openingh.ypid.de/evaluation_tool/?lng=en
  // https://github.com/opening-hours/opening_hours.js
  const { value } = props;
  let lat, lon, country, state;
  const feature = React.useContext(FeatureContext);
  if (isOSMFeature(feature)) {
    lat = feature.geometry.coordinates[1];
    lon = feature.geometry.coordinates[0];
    country = feature.properties['addr:country'];
    state = feature.properties['addr:state'];
  }

  try {
    const oh = new opening_hours(value, { lat, lon, address: { country_code: country, state } });
    const isOpen = oh.getState(); // for current date
    const nextChangeDate = oh.getNextChange();
    const outputs = getReadableState(oh);
  
    if (typeof nextChangeDate === "undefined")
      outputs.push(t`(indefinitely)`);
    else {
      const isUnknown = oh.getUnknown(nextChangeDate);
      const nextChangeDateTime = DateTime.fromJSDate(nextChangeDate);
      const nextChangeDateFormatted = nextChangeDateTime.toRelative();
  
      if (!isUnknown && !isOpen) {
        outputs.push(t`Will open ${nextChangeDateFormatted}.`);
      } else if (!isUnknown && isOpen) {
        outputs.push(t`Will close ${nextChangeDateFormatted}.`);
      } else if (isUnknown && !isOpen) {
        outputs.push(t`Might open on ${nextChangeDateFormatted}.`);
      } else if (isUnknown && isOpen) {
        outputs.push(t`Might close on ${nextChangeDateFormatted}.`);
      }
    }

    return <>
      <strong>
        <StyledMarkdown inline={true} element='span'>
          {outputs[0]}
        </StyledMarkdown>
      </strong>

      {outputs.length > 1 && <>
        &nbsp;
        <StyledMarkdown inline={true} element='span'>
          {outputs.slice(1).join(' ')}
        </StyledMarkdown>
      </>}
    </>;
  } catch (e) {
    console.error(e);
    return <>{value}</>;
  }
}