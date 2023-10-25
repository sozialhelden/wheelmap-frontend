import React from "react";
import { t } from "ttag";
import { MockFacility } from "..";

type Props = {
  data: MockFacility[]
}
function FilterInputs ({ data }: Props) {
  const mockedHealthcareFacilities = data;

  // Todo: Custom Select for large select menu
  return (
    <React.Fragment>
      <div id="survey-form-titel" className="survey-form-titel">Allgemeine Angaben</div>
      <div className="search-filter-inputs" role="group" aria-labelledby="survey-form-titel">
        <label htmlFor="place">{t`Ort`}</label>
        <input type="text" name="" id="place" />
        <label htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</label>
        <select name="facilities" id="facilities-select">
            <option value="">{t`--Bitte Option auswählen--`}</option>
            {mockedHealthcareFacilities.map((item, index) => <option key={item.de+(index++).toString()} value={item.de}>{item.de}</option>)}
        </select>
        <label htmlFor="insurance-type">{t`Versicherungsart`}</label>
        <select name="insurance-type" id="insurance-type">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="privat">{t`Private Krankenversicherung`}</option>
          <option value="öffentlich">{t`Öffentliche Krankenversicherung`}</option>
        </select>      
      </div>
    </React.Fragment>
  );
}

export default FilterInputs;