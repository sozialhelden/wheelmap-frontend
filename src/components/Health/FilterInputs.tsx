import React from "react";
import { t } from "ttag";
import { FilterContext, FilterContextType } from "./FilterContext";
import { MockFacility } from "./mocks";
import { StyledLabel, StyledLegend, StyledSearchFilterInputs, StyledSelect, StyledTextInput } from "./styles";

type Props = {
  mockedFacilities: MockFacility[];
};

function FilterInputs({ mockedFacilities }: Props) {
  const fc: FilterContextType = React.useContext(FilterContext);

  const [extent, setExtent] = React.useState<string>("");
  const [placeQuery, setPlaceQuery] = React.useState<string>("");

  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setPlaceQuery(e.target.value);
    }, 2000);
  };

  React.useEffect(() => {
    if (placeQuery) {
      setExtent(placeQuery);
      fc.setExtent(extent);
    }
  }, [extent, fc, placeQuery]);

  return (
    <React.Fragment>
      <StyledLegend>{t`Allgemeine Angaben`}</StyledLegend>
      <StyledSearchFilterInputs role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place">{t`Ort`}</StyledLabel>
        <StyledTextInput type="text" name="" id="place" onChange={handleOnChange} />
        <StyledLabel htmlFor="facilities-select">{t`Name Fachgebiet Einrichtung`}</StyledLabel>

        <StyledSelect name="facilities" id="facilities-select">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          {mockedFacilities.map((item, index) => (
            <option key={item.de + (index++).toString()} value={item.de}>
              {item.de}
            </option>
          ))}
        </StyledSelect>

        <StyledLabel htmlFor="insurance-type">{t`Versicherungsart`}</StyledLabel>

        <StyledSelect name="insurance-type" id="insurance-type">
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="privat">{t`Private Krankenversicherung`}</option>
          <option value="öffentlich">{t`Öffentliche Krankenversicherung`}</option>
        </StyledSelect>
      </StyledSearchFilterInputs>
    </React.Fragment>
  );
}

export default FilterInputs;
