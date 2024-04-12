import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import { t } from "ttag";
import { useCurrentLanguageTagStrings } from "../../lib/context/LanguageTagContext";
import { useCategorySynonymCache } from "../../lib/fetchers/fetchAccessibilityCloudCategories";
import { getLocalizedStringTranslationWithMultipleLocales } from "../../lib/i18n/getLocalizedStringTranslationWithMultipleLocales";
import { getCategory } from "../../lib/model/ac/categories/Categories";
import AccessibilityFilterButton from "../SearchPanel/AccessibilityFilterButton";
import EnvContext from "../shared/EnvContext";
import { fetcher, transferCityToBbox, useOsmAPI } from "./helpers";
import { StyledHDivider, StyledLabel, StyledSectionsContainer, StyledSelect, StyledTextInput, StyledWheelchairFilter } from "./styles";

function FilterInputs() {
  const route = useRouter();
  const [healthcareOptions, setHealthcareOptions] = React.useState<any[]>([]);
  const env = useContext(EnvContext);

  const handleRoute = async (event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "city") {
      route.push({
        query: {
          ...route.query,
          [name]: value,
        },
      });
    }
  };

  const reloadHealthcareOptions = async () => {
    const options = {
      ...(route.query.bbox && { bbox: route.query.bbox }),
      ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
      ...(route.query.healthcare && { healthcare: route.query.healthcare }),
      tags: "healthcare",
    };
    const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
    const dataHealthcareOptions = await fetcher(useOsmAPI(options, baseurl, true).toString());
    setHealthcareOptions(dataHealthcareOptions);
  };

  const convertCityToBbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const dataCityToBBox = await fetcher(transferCityToBbox(value));
    const bbox = await dataCityToBBox?.features?.find((feature: any) => feature?.properties?.osm_value === "city" && feature?.properties?.countrycode === "DE")?.properties?.extent;
    route.push({
      query: {
        ...route.query,
        [name]: value,
        bbox: bbox,
      },
    });
  };

  React.useEffect(() => {
    if (route.query.bbox) reloadHealthcareOptions();
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
        <StyledTextInput type="text" defaultValue={route.query.city} name="city" id="city" onChange={convertCityToBbox} />

        {route.query.city && translatedHealthcareOptions && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
            <StyledSelect defaultValue={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleRoute}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions &&
                translatedHealthcareOptions.length > 0 &&
                translatedHealthcareOptions?.map((item, index) => (
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
              <AccessibilityFilterButton accessibilityFilter={[]} caption={t`All places`} category="wheelchair" toiletFilter={[]} isActive={route.query.wheelchair === undefined} showCloseButton={false} />
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
