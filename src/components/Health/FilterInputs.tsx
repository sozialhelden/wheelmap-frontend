import React from "react";
import useSWR from "swr";
import { t } from "ttag";
import { FilterContext, FilterContextType } from "./FilterContext";
import {
  FilterOptions,
  defaultFilterOptions,
  fetcher,
  getFilterOptions,
  transferCityToBbox,
} from "./helpers";
import {
  StyledLabel,
  StyledLegend,
  StyledSearchFilterInputs,
  StyledSelect,
  StyledTextInput,
} from "./styles";

function FilterInputs() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(
    defaultFilterOptions
  );
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);
  const [
    healthcareSpecialityOptions,
    setHealthcareSpecialityOptions,
  ] = React.useState<any[]>([]);
  const [city, setCity] = React.useState<string>("");

  const cityToBBoxURL = transferCityToBbox({
    city: city,
  });

  const healthcareOptionsURL = getFilterOptions({
    bbox: filterOptions.bbox,
    wheelchair: filterOptions.wheelchair,
    tags: "healthcare",
  });

  const healthcareSpecialityOptionsURL = getFilterOptions({
    bbox: filterOptions.bbox,
    wheelchair: filterOptions.wheelchair,
    tags: "healthcare:speciality",
  });

  const { data: dataCityToBBox, error: errorCityTiBBox } = useSWR<any, Error>(
    cityToBBoxURL,
    fetcher
  );
  const { data: dataHealthcareOptions, error: errorHealthcareOptions } = useSWR<
    any,
    Error
  >(healthcareOptionsURL, fetcher);
  const {
    data: dataHealthcareSpecialityOptions,
    error: errorHealthcareSpecialityOptions,
  } = useSWR<any, Error>(healthcareSpecialityOptionsURL, fetcher);

  const handleOnChangeCity = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    handleFilterOptions("city", e.target.value);
  };

  const handleOnChangeWheelchair = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleFilterOptions("wheelchair", e.target.value);
  };

  const handleOnChangeHealthcare = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleFilterOptions("healthcare", e.target.value);
  };

  const handleOnChangeHealthcareSpeciality = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    handleFilterOptions("healthcare:speciality", e.target.value);
  };

  const handleOnChangeSort = (e: React.ChangeEvent<HTMLSelectElement>) => {
    handleFilterOptions("sort", e.target.value);
  };

  const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
    handleFilterOptions("name", e.target.value);
  };

  const handleFilterOptions = (key: string, value: any) => {
    setFilterOptions({
      ...filterOptions,
      [key]: value,
    });
    setHealthcareOptions(dataHealthcareOptions);
    setHealthcareSpecialityOptions(dataHealthcareSpecialityOptions);
  };

  React.useEffect(() => {
    if (filterOptions) {
      fc.setFilterOptions(filterOptions);
    }
  }, [fc, filterOptions]);

  React.useEffect(() => {
    if (city && dataCityToBBox) {
      try {
        const finalData =
          dataCityToBBox.features.find(
            (feature: any) =>
              feature.properties.osm_value === "city" &&
              feature.properties.countrycode === "DE"
          ).properties.extent || defaultFilterOptions.bbox;
        setFilterOptions({
          ...filterOptions,
          bbox: finalData,
        });
        setHealthcareOptions(dataHealthcareOptions);
        setHealthcareSpecialityOptions(dataHealthcareSpecialityOptions);
      } catch (e) {}
    }
  }, [
    city,
    dataCityToBBox,
    dataHealthcareOptions,
    dataHealthcareSpecialityOptions,
    filterOptions,
  ]);

  return (
    <React.Fragment>
      <StyledLegend>{t`Allgemeine Angaben`}</StyledLegend>
      <StyledSearchFilterInputs
        role="group"
        aria-labelledby="survey-form-titel"
      >
        <StyledLabel htmlFor="place">{t`Ort`}</StyledLabel>
        <StyledTextInput
          placeholder={t`Berlin`}
          type="text"
          name=""
          id="place"
          onChange={handleOnChangeCity}
        />

        {false && (
          <>
            <StyledLabel htmlFor="name">{t`Suche nach`}</StyledLabel>
            <StyledTextInput
              placeholder={t`Suchen`}
              type="text"
              name=""
              id="name"
              onChange={handleChangeName}
            />
          </>
        )}

        {true && (
          <>
            <StyledLabel htmlFor="sort-select">{t`Sort`}</StyledLabel>
            <StyledSelect
              defaultValue={"distance:asc"}
              name="sort"
              id="sort-select"
              onChange={handleOnChangeSort}
            >
              <option value="d:asc">{t`Nach Abstand Sortieren (ASC)`}</option>
              <option value="d:desc">{t`Nach Abstand Sortieren (DESC)`}</option>
              <option value="a:asc">{t`Nach Alphabet Sortieren (ASC)`}</option>
              <option value="a:desc">{t`Nach Alphabet Sortieren (DESC)`}</option>
            </StyledSelect>
          </>
        )}

        {true && (
          <>
            <StyledLabel htmlFor="healthcare-select">{t`Einrichtungsart`}</StyledLabel>
            <StyledSelect
              defaultValue={""}
              name="healthcare"
              id="healthcare-select"
              onChange={handleOnChangeHealthcare}
            >
              <option value="">{t`Alle`}</option>
              {healthcareOptions?.map((item, index) => (
                <option
                  key={item.healthcare + (index++).toString()}
                  value={item.healthcare}
                >
                  {`(${
                    item.count
                  }) ${t`${item.healthcare
                    .toLocaleUpperCase()
                    .substring(0, 25)}`}`}
                </option>
              ))}
            </StyledSelect>
          </>
        )}

        {false && (
          <>
            <StyledLabel htmlFor="healthcare-speciality-select">{t`Einrichtungsart Spezialisierung`}</StyledLabel>
            <StyledSelect
              defaultValue={""}
              name="healthcare-speciality"
              id="healthcare-speciality-select"
              onChange={handleOnChangeHealthcareSpeciality}
            >
              <option value="">{t`--Alle--`}</option>
              {healthcareSpecialityOptions?.map((item, index) => (
                <option
                  key={item["healthcare:speciality"] + (index++).toString()}
                  value={item["healthcare:speciality"]}
                >
                  {`(${item.count}) ${t`${item["healthcare:speciality"]
                    ?.toLocaleUpperCase()
                    .substring(0, 25)}`}`}
                </option>
              ))}
            </StyledSelect>
          </>
        )}

        <StyledLabel htmlFor="wheelchair-select">{t`Rollstuhlgerecht`}</StyledLabel>
        <StyledSelect
          defaultValue={"yes"}
          name="wheelchair"
          id="wheelchair-select"
          onChange={handleOnChangeWheelchair}
        >
          <option value="">{t`--Alle--`}</option>
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
