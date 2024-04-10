import { useRouter } from "next/router";
import React, { useMemo } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import { fetcher, useOsmAPI } from "./helpers";
import { StyledHDivider, StyledLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const [routeFilters, setRouteFilters] = React.useState<any>(route.query);
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);

  const healthcareOptionsURL = useOsmAPI(
    {
      ...(route.query.bbox && { bbox: route.query.bbox }),
      ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
      ...(route.query.healthcare && { healthcare: route.query.healthcare }),
      tags: "healthcare",
    },
    true
  );

  const { data: dataCityToBBox, error: errorCityTiBBox } = useSWR<any, Error>(route.query.bbox, fetcher);
  const { data: dataHealthcareOptions, error: errorHealthcareOptions } = useSWR<any, Error>(healthcareOptionsURL, fetcher);

  React.useEffect(() => {
    setRouteFilters(route.query);
  }, [route.query]);

  const handleRoute = (event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>, bbox?: [number, number, number, number]) => {
    const { name, value } = event.target;
    route.push({
      query: {
        ...route.query,
        [name]: value,
      },
    });
  };

  const isVisible = React.useMemo(() => {
    return route.query.city;
  }, [route.query]);

  const synonymCache = useCategorySynonymCache();
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

  return (
    <>
      {JSON.stringify(routeFilters)}
      <StyledSectionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="city" $fontBold="bold">{t`Where?`}</StyledLabel>
        <StyledTextInput type="text" defaultValue={route.query.city} name="city" id="city" onChange={handleRoute} />

        {isVisible && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
            <StyledSelect defaultValue={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleRoute}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions?.map((item, index) => (
                <option key={item.healthcare + (index++).toString()} value={item.healthcare}>
                  {`${item.healthcareTranslated || item.healthcare} (${item.count})`}
                </option>
              ))}
            </StyledSelect>

            <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
            <StyledSelect defaultValue={route.query.sort} name="sort" id="sort-select" onChange={handleRoute}>
              <option value="distance">{t`By distance`}</option>
              <option value="alphabetically">{t`Alphabetically`}</option>
            </StyledSelect>

            <StyledWheelchairFilter>
              <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
              <StyledHDivider $space={0.25} />
              <AccessibilityFilterButton accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "all"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["yes"]} caption={t`Yes`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "yes"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["no"]} caption={t`No`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "no"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["limited"]} caption={t`Partially`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "limited"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["unknown"]} caption={t`Unknown`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === "unknown"} showCloseButton={false} />
            </StyledWheelchairFilter>
          </>
        )}
      </StyledSectionsContainer>
    </>
  );
}

export default FilterInputs;
