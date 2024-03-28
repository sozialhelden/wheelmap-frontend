import React, { useCallback, useContext, useMemo } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { useCurrentAppToken } from "../../lib/context/AppContext";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { FilterContext, FilterContextType } from "./FilterContext";
import { FilterOptions, defaultFilterOptions, fetcher, transferCityToBbox, useFilterOptionsUrl } from "./helpers";
import { StyledHDivider, StyledLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

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
  const env = useContext(EnvContext);
  const baseurl: string = env.NEXT_PUBLIC_ACCESSIBILITY_CLOUD_BASE_URL;
  const synonymCache = useCategorySynonymCache(appToken, baseurl);
  const languageTags = useCurrentLanguageTagStrings();
  const translatedHealthcareOptions = useMemo(() => {
    if (!synonymCache.data) {
      return healthcareOptions;
    }
    return healthcareOptions
      ?.map((item) => {
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

  const isDisabled = React.useMemo(() => {
    return !city;
  }, [city]);

  return (
    <>
      <StyledSectionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="place" $fontBold="bold">{t`Where?`}</StyledLabel>
        <StyledTextInput
          type="text"
          name=""
          id="place"
          value={city || ""}
          onChange={(e) => {
            const cityName = e.target.value.trim();
            setCity(cityName);
            handleFilterOptions("city", cityName);
          }}
        />

        <>
          <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
          <StyledSelect disabled={isDisabled} defaultValue={""} name="healthcare" id="healthcare-select" onChange={(e) => handleFilterOptions("healthcare", e.target.value)}>
            <option value="">{t`Alle`}</option>
            {translatedHealthcareOptions?.map((item, index) => (
              <option key={item.healthcare + (index++).toString()} value={item.healthcare}>
                {`${item.healthcareTranslated || item.healthcare} (${item.count})`}
              </option>
            ))}
          </StyledSelect>
        </>

        <>
          <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
          <StyledSelect disabled={isDisabled} defaultValue={""} name="sort" id="sort-select" onChange={(e) => handleFilterOptions("sort", e.target.value)}>
            <option value="d:asc">{t`By distance`}</option>
            <option value="a:asc">{t`Alphabetically`}</option>
          </StyledSelect>
        </>

        <StyledWheelchairFilter>
          <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
          <StyledHDivider $space={0.25} />
          <AccessibilityFilterButton isDisabled={isDisabled} accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} onFocus={() => handleFilterOptions("wheelchair", "")} isActive={filterOptions.wheelchair === "all"} showCloseButton={false} />
          <AccessibilityFilterButton isDisabled={isDisabled} accessibilityFilter={["yes"]} caption={t`Yes`} category="wheelchair" toiletFilter={[]} onFocus={() => handleFilterOptions("wheelchair", "yes")} isActive={filterOptions.wheelchair === "yes"} showCloseButton={false} />
          <AccessibilityFilterButton isDisabled={isDisabled} accessibilityFilter={["no"]} caption={t`No`} category="wheelchair" toiletFilter={[]} onFocus={() => handleFilterOptions("wheelchair", "no")} isActive={filterOptions.wheelchair === "no"} showCloseButton={false} />
          <AccessibilityFilterButton isDisabled={isDisabled} accessibilityFilter={["limited"]} caption={t`Partially`} category="wheelchair" toiletFilter={[]} onFocus={() => handleFilterOptions("wheelchair", "limited")} isActive={filterOptions.wheelchair === "limited"} showCloseButton={false} />
          <AccessibilityFilterButton isDisabled={isDisabled} accessibilityFilter={["unknown"]} caption={t`Unknown`} category="wheelchair" toiletFilter={[]} onFocus={() => handleFilterOptions("wheelchair", "unknown")} isActive={filterOptions.wheelchair === "unknown"} showCloseButton={false} />
        </StyledWheelchairFilter>
      </StyledSectionsContainer>
    </>
  );
}

export default FilterInputs;
