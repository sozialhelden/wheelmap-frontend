import React, { useCallback } from "react";
import useSWR from "swr";
import { t } from "ttag";
import AccessibilityFilterButtonOnClick from "./AccessibilityFilterButtonOnClick";
import { FilterContext, FilterContextType } from "./FilterContext";
import { FilterOptions, defaultFilterOptions, fetcher, transferCityToBbox, useFilterOptionsUrl } from "./helpers";
import { StyledLabel, StyledSecionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(defaultFilterOptions);
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);
  const [city, setCity] = React.useState<string>("");

  const cityToBBoxURL = transferCityToBbox({
    city: city,
  });

  const healthcareOptionsURL = useFilterOptionsUrl({
    ...filterOptions,
    tags: "healthcare",
  });

  const { data: dataCityToBBox, error: errorCityTiBBox } = useSWR<any, Error>(cityToBBoxURL, fetcher);
  const { data: dataHealthcareOptions, error: errorHealthcareOptions } = useSWR<any, Error>(healthcareOptionsURL, fetcher);

  const handleFilterOptions = useCallback(
    (key: string, value: any) => {
      setFilterOptions({
        ...filterOptions,
        [key]: value,
      });
      setHealthcareOptions(dataHealthcareOptions);
    },
    [filterOptions, dataHealthcareOptions]
  );

  React.useEffect(() => {
    if (filterOptions) {
      fc.setFilterOptions(filterOptions);
    }
  }, [fc, filterOptions]);

  React.useEffect(() => {
    if (city) {
      try {
        const finalData = dataCityToBBox.features.find((feature: any) => feature.properties.osm_value === "city" && feature.properties.countrycode === "DE").properties.extent || defaultFilterOptions.bbox;
        handleFilterOptions("bbox", finalData);
      } catch (e) {
        setFilterOptions(defaultFilterOptions);
      }
    }
  }, [city, dataCityToBBox, handleFilterOptions]);

  return (
    <>
      <StyledSecionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place" $fontBold="bold">{t`In Ort`}</StyledLabel>
        <StyledTextInput
          type="text"
          name=""
          id="place"
          onChange={(e) => {
            setCity(e.target.value);
            handleFilterOptions("city", e.target.value);
          }}
        />

        {true && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Nach Gesundheitseinrichtungen`}</StyledLabel>
            <StyledSelect defaultValue={""} name="healthcare" id="healthcare-select" onChange={(e) => handleFilterOptions("healthcare", e.target.value)}>
              <option value="">{t`Alle`}</option>
              {healthcareOptions?.map((item, index) => (
                <option key={item.healthcare + (index++).toString()} value={item.healthcare}>
                  {`(${item.count}) ${t`${item.healthcare}`}`}
                </option>
              ))}
            </StyledSelect>
          </>
        )}

        {true && (
          <>
            <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Mit Sortierung`}</StyledLabel>
            <StyledSelect defaultValue={""} name="sort" id="sort-select" onChange={(e) => handleFilterOptions("sort", e.target.value)}>
              <option value="d:asc">{t`Nach Entfernung (Aufsteigend)`}</option>
              <option value="d:desc">{t`Nach Entfernung (Absteigend)`}</option>
              <option value="a:asc">{t`Nach Alphabet (Aufsteigend)`}</option>
              <option value="a:desc">{t`Nach Alphabet (Absteigend)`}</option>
            </StyledSelect>
          </>
        )}

        {true && (
          <StyledWheelchairFilter>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Mit Rollstuhlgerechtigkeit`}</StyledLabel>
            <AccessibilityFilterButtonOnClick accessibilityFilter={[]} caption={t`Alle`} onFocus={() => handleFilterOptions("wheelchair", "")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["yes"]} caption={t`Ja`} onFocus={() => handleFilterOptions("wheelchair", "yes")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["no"]} caption={t`Nein`} onFocus={() => handleFilterOptions("wheelchair", "no")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["limited"]} caption={t`Teilweise`} onFocus={() => handleFilterOptions("wheelchair", "limited")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["unknown"]} caption={t`Unbekannt`} onFocus={() => handleFilterOptions("wheelchair", "unknown")} />
          </StyledWheelchairFilter>
        )}
      </StyledSecionsContainer>
    </>
  );
}

export default FilterInputs;
