import React from "react";
import { t } from "ttag";
import { FilterContext, FilterContextType } from "./FilterContext";
import { mockedHealthcare } from "./mocks";
import {
  StyledLabel,
  StyledLegend,
  StyledSearchFilterInputs,
  StyledSelect,
  StyledTextInput,
} from "./styles";

function FilterInputs() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const [extent, setExtent] = React.useState<string>("");
  const [cityQuery, setCityQuery] = React.useState<string>("");
  const [wheelchair, setWheelchair] = React.useState<string>("");
  const [healthcare, setHealthcare] = React.useState<string>("");

  const handleOnChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setCityQuery(e.target.value);
    }, 2000);
  };

  const handleOnChangeWheelchair = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setWheelchair(e.target.value);
  };

  const handleOnChangeHealthcare = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setHealthcare(e.target.value);
  };

  React.useEffect(() => {
    if (cityQuery) {
      setExtent(cityQuery);
      fc.setExtent(extent);
    }
  }, [extent, fc, cityQuery]);

  return (
    <React.Fragment>
      <StyledLegend>{t`Allgemeine Angaben`}</StyledLegend>
      <StyledSearchFilterInputs
        role="group"
        aria-labelledby="survey-form-titel"
      >
        <StyledLabel htmlFor="place">{t`Ort`}</StyledLabel>
        <StyledTextInput
          type="text"
          name=""
          id="place"
          onChange={handleOnChangeCity}
        />

        <StyledLabel htmlFor="healthcare-select">
          {t`Einrichtungsart`} : {healthcare}
        </StyledLabel>
        <StyledSelect
          name="healthcare"
          id="healthcare-select"
          onChange={handleOnChangeHealthcare}
        >
          <option value="">{t`--Bitte Option auswählen--`}</option>
          {mockedHealthcare.map((item, index) => (
            <option key={item.value + (index++).toString()} value={item.value}>
              {item.label}
            </option>
          ))}
        </StyledSelect>

        <StyledLabel htmlFor="wheelchair-select">
          {t`Rollstuhlgerecht`} : {wheelchair}
        </StyledLabel>
        <StyledSelect
          name="wheelchair"
          id="wheelchair-select"
          onChange={handleOnChangeWheelchair}
        >
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="yes">{t`Ja`}</option>
          <option value="no">{t`Nein`}</option>
          <option value="limited">{t`Teilweise`}</option>
          <option value="unknown">{t`Unbekannt`}</option>
        </StyledSelect>
      </StyledSearchFilterInputs>
    </React.Fragment>
  );
}

export default FilterInputs;
