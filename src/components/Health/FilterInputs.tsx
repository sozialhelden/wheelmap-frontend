import React, { useCallback, useMemo } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { useCurrentAppToken } from "../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButtonOnClick from "./AccessibilityFilterButtonOnClick";
import { FilterContext, FilterContextType } from "./FilterContext";
import { FilterOptions, defaultFilterOptions, fetcher, transferCityToBbox, useFilterOptionsUrl } from "./helpers";
import { StyledLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";


function FilterInputs() {
  const fc: FilterContextType = React.useContext(FilterContext);
  const [filterOptions, setFilterOptions] = React.useState<FilterOptions>(defaultFilterOptions);
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);
  const [city, setCity] = React.useState<string | undefined>(undefined);

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

  const appToken = useCurrentAppToken();
  const synonymCache = useCategorySynonymCache(appToken);
  const languageTags = useCurrentLanguageTagStrings();
  const translatedHealthcareOptions = useMemo(() => {
    if (!synonymCache.data) {
      return healthcareOptions;
    }
    return  healthcareOptions?.map((item) => {
      const translatedCategoryName = getLocalizedStringTranslationWithMultipleLocales(getCategory(synonymCache.data, `healthcare=${item.healthcare}`)?.translations?._id, languageTags);
      return {
        ...item,
        healthcareTranslated: translatedCategoryName,
        healthcareTranslatedLowercase: (translatedCategoryName || item.healthcare)?.toLocaleLowerCase(),
      };
    })
    .sort((i1, i2) => {
      const a = i1.healthcareTranslatedLowercase;
      const b = i2.healthcareTranslatedLowercase;
      return a.localeCompare(b);
    });
  }, [healthcareOptions]);

  return (
    <>
      <StyledSectionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place" $fontBold="bold">{t`Where?`}</StyledLabel>
        <StyledTextInput
          type="text"
          name=""
          id="place"
          onChange={(e) => {
            const cityName = e.target.value.trim();
            if (cityName.length) {
              setCity(cityName);
              handleFilterOptions("city", cityName);
            }
          }}
        />

        {true && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
            <StyledSelect defaultValue={""} name="healthcare" id="healthcare-select" onChange={(e) => handleFilterOptions("healthcare", e.target.value)}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions?.map((item, index) => (
                <option key={item.healthcare + (index++).toString()} value={item.healthcare}>
                  {`${item.healthcareTranslated || item.healthcare} (${item.count})`}
                </option>
              ))}
            </StyledSelect>
          </>
        )}

        {true && (
          <StyledWheelchairFilter>
            <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
            <AccessibilityFilterButtonOnClick accessibilityFilter={[]} caption={t`All places`} onFocus={() => handleFilterOptions("wheelchair", "")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["yes"]} caption={t`Yes`} onFocus={() => handleFilterOptions("wheelchair", "yes")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["no"]} caption={t`No`} onFocus={() => handleFilterOptions("wheelchair", "no")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["limited"]} caption={t`Partially`} onFocus={() => handleFilterOptions("wheelchair", "limited")} />
            <AccessibilityFilterButtonOnClick accessibilityFilter={["unknown"]} caption={t`Unknown`} onFocus={() => handleFilterOptions("wheelchair", "unknown")} />
          </StyledWheelchairFilter>
        )}

        {true && (
          <>
            <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
            <StyledSelect defaultValue={""} name="sort" id="sort-select" onChange={(e) => handleFilterOptions("sort", e.target.value)}>
              <option value="d:asc">{t`By distance`}</option>
              <option value="a:asc">{t`Alphabetically`}</option>
            </StyledSelect>
          </>
        )}

      </StyledSectionsContainer>
    </>
  );
}

export default FilterInputs;
