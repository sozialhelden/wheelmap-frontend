import React from "react";
import { t } from "ttag";
import { FilterContext, FilterContextType } from "./FilterContext";
import { FilterOptions, defaultFilterOptions } from "./helpers";
import { mockedHealthcare, mockedHealthcareSpeciality } from "./mocks";
import { StyledLabel, StyledLegend, StyledSearchFilterInputs, StyledSelect, StyledTextInput } from "./styles";

function FilterInputs() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(defaultFilterOptions);

  const handleOnChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTimeout(() => {
      setFilterOptions({
        ...filterOptions,
        city: e.target.value,
      });
    }, 2000);
  };

  const handleOnChangeWheelchair = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      wheelchair: e.target.value,
    });
  };

  const handleOnChangeHealthcare = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      healthcare: e.target.value,
    });
  };

  const handleOnChangeHealthcareSpeciality = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      "healthcare:speciality": e.target.value,
    });
  };

  const handleOnChangeLimit = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFilterOptions({
      ...filterOptions,
      limit: e.target.value,
    });
  };

  React.useEffect(() => {
    if (filterOptions) {
      fc.setFilterOptions(filterOptions);
    }
  }, [fc, filterOptions]);

  return (
    <React.Fragment>
      <StyledLegend>{t`Allgemeine Angaben`}</StyledLegend>
      <StyledSearchFilterInputs role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place">{t`Ort`}</StyledLabel>
        <StyledTextInput type="text" name="" id="place" onChange={handleOnChangeCity} />

        <StyledLabel htmlFor="healthcare-select">
          {t`Einrichtungsart`} : {filterOptions.healthcare}
        </StyledLabel>
        <StyledSelect name="healthcare" id="healthcare-select" onChange={handleOnChangeHealthcare}>
          <option value="">{t`--Bitte Option auswählen--`}</option>
          {mockedHealthcare.map((item, index) => (
            <option key={item.value + (index++).toString()} value={item.value}>
              {item.label}
            </option>
          ))}
        </StyledSelect>

        <StyledLabel htmlFor="healthcare-speciality-select">
          {t`Einrichtungsart Spezialisierung`} : {filterOptions["healthcare:speciality"]}
        </StyledLabel>
        <StyledSelect name="healthcare-speciality" id="healthcare-speciality-select" onChange={handleOnChangeHealthcareSpeciality}>
          <option value="">{t`--Bitte Option auswählen--`}</option>
          {mockedHealthcareSpeciality.map((item, index) => (
            <option key={item.value + (index++).toString()} value={item.value}>
              {item.label}
            </option>
          ))}
        </StyledSelect>

        <StyledLabel htmlFor="wheelchair-select">
          {t`Rollstuhlgerecht`} : {filterOptions.wheelchair}
        </StyledLabel>
        <StyledSelect name="wheelchair" id="wheelchair-select" onChange={handleOnChangeWheelchair}>
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="yes">{t`Ja`}</option>
          <option value="no">{t`Nein`}</option>
          <option value="limited">{t`Teilweise`}</option>
        </StyledSelect>

        <StyledLabel htmlFor="limit-select">
          {t`Suchgrenze (Anzahl)`} : {filterOptions.limit}
        </StyledLabel>
        <StyledSelect name="limit" id="limit-select" onChange={handleOnChangeLimit}>
          <option value="">{t`--Bitte Option auswählen--`}</option>
          <option value="100">100</option>
          <option value="1000">1000</option>
          <option value="10000">10000</option>
        </StyledSelect>
      </StyledSearchFilterInputs>
    </React.Fragment>
  );
}

export default FilterInputs;
