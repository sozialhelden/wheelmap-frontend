import { useRouter } from "next/router";
import React, { useMemo } from "react";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import { fetcher, transferCityToBbox, useOsmAPI } from "./helpers";
import { StyledHDivider, StyledLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const [routeFilters, setRouteFilters] = React.useState<any>(route.query);
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);

  const handleRoute = async (event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "city") {
      route.push({
        query: {
          ...routeFilters,
          [name]: value,
        },
      });
    }
  };

  const reloadHealthcareOptions = async () => {
    const baseurl: string = process.env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
    const options = {
      ...(routeFilters.bbox && { bbox: routeFilters.bbox }),
      ...(routeFilters.wheelchair && { wheelchair: routeFilters.wheelchair }),
      ...(routeFilters.healthcare && { healthcare: routeFilters.healthcare }),
      tags: "healthcare",
    };
    const dataHealthcareOptions = await fetcher(useOsmAPI(options, baseurl, true).toString());
    setHealthcareOptions(dataHealthcareOptions);
  };

  const convertCityToBbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const dataCityToBBox = await fetcher(transferCityToBbox(value));
    const bbox = await dataCityToBBox?.features?.find((feature: any) => feature?.properties?.osm_value === "city" && feature?.properties?.countrycode === "DE")?.properties?.extent;
    route.push({
      query: {
        ...routeFilters,
        [name]: value,
        bbox: bbox,
      },
    });
  };

  React.useEffect(() => {
    setRouteFilters(routeFilters);
    reloadHealthcareOptions();
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
      <StyledSectionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="city" $fontBold="bold">{t`Where?`}</StyledLabel>
        <StyledTextInput type="text" defaultValue={routeFilters.city} name="city" id="city" onChange={convertCityToBbox} />

        {routeFilters.city && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
            <StyledSelect defaultValue={routeFilters.healthcare} name="healthcare" id="healthcare-select" onChange={handleRoute}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions &&
                translatedHealthcareOptions?.map((item, index) => (
                  <option key={item.healthcare + (index++).toString()} value={item.healthcare}>
                    {`${item.healthcareTranslated || item.healthcare} (${item.count})`}
                  </option>
                ))}
            </StyledSelect>

            <StyledLabel htmlFor="sort-select" $fontBold="bold">{t`Sort results`}</StyledLabel>
            <StyledSelect defaultValue={routeFilters.sort} name="sort" id="sort-select" onChange={handleRoute}>
              <option value="distance">{t`By distance`}</option>
              <option value="alphabetically">{t`Alphabetically`}</option>
            </StyledSelect>

            <StyledWheelchairFilter>
              <StyledLabel htmlFor="wheelchair-select" $fontBold="bold">{t`Wheelchair accessible?`}</StyledLabel>
              <StyledHDivider $space={0.25} />
              <AccessibilityFilterButton accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} isActive={routeFilters.wheelchair === "all"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["yes"]} caption={t`Yes`} category="wheelchair" toiletFilter={[]} isActive={routeFilters.wheelchair === "yes"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["no"]} caption={t`No`} category="wheelchair" toiletFilter={[]} isActive={routeFilters.wheelchair === "no"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["limited"]} caption={t`Partially`} category="wheelchair" toiletFilter={[]} isActive={routeFilters.wheelchair === "limited"} showCloseButton={false} />
              <AccessibilityFilterButton accessibilityFilter={["unknown"]} caption={t`Unknown`} category="wheelchair" toiletFilter={[]} isActive={routeFilters.wheelchair === "unknown"} showCloseButton={false} />
            </StyledWheelchairFilter>
          </>
        )}
      </StyledSectionsContainer>
    </>
  );
}

export default FilterInputs;
