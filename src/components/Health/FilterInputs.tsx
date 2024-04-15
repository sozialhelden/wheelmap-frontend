import { useRouter } from "next/router";
import React, { useContext, useMemo } from "react";
import useSWR from "swr";
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
  const [isVisible, setIsVisible] = React.useState(false);
  const env = useContext(EnvContext);

  const handleRoute = async (event: React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    if (name !== "city") {
      route.replace({
        pathname: route.pathname,
        query: {
          ...route.query,
          [name]: value,
        },
      });
    }
  };

  const generalRouteQueries = {
    ...(route.query.bbox && { bbox: route.query.bbox }),
    ...(route.query.wheelchair && { wheelchair: route.query.wheelchair }),
    ...(route.query.healthcare && { healthcare: route.query.healthcare }),
  };

  const baseurl: string = env.NEXT_PUBLIC_OSM_API_BACKEND_URL;
  const { data: dataCityToBbox, error: errorCityToBbox, isLoading: isLoadingCityToBbox } = useSWR<any, Error>(transferCityToBbox(Array.isArray(route.query.city) ? route.query.city[0] : route.query.city), fetcher);

  const options = {
    ...generalRouteQueries,
    tags: "healthcare",
  };
  const { data: dataHealthcareOptions, error: errorHealthcareOptions, isLoading: isLoadingHealthcareOptions } = useSWR<any, Error>(useOsmAPI(options, baseurl, true), fetcher);

  const reloadHealthcareOptions = async () => {
    setHealthcareOptions(dataHealthcareOptions);
  };

  const convertCityToBbox = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    const bbox = await dataCityToBbox?.features?.find((feature: any) => feature?.properties?.osm_value === "city" && feature?.properties?.countrycode === "DE")?.properties?.extent;
    route.replace(
      {
        pathname: route.pathname,
        query: {
          ...route.query,
          [name]: value,
          bbox: bbox,
        },
      },
      undefined,
      { shallow: true }
    );
  };

  React.useEffect(() => {
    if (route.query.bbox) reloadHealthcareOptions();
    if (route.query.city) setIsVisible(true);
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
  }, [dataCityToBbox]);

  return (
    <>
      <StyledSectionsContainer role="group" aria-labelledby="survey-form-titel">
        <StyledLabel htmlFor="city" $fontBold="bold">{t`Where?`}</StyledLabel>
        <StyledTextInput type="text" defaultValue={route.query.city} name="city" id="city" onChange={convertCityToBbox} />

        {route.query.city && (
          <>
            <StyledLabel htmlFor="healthcare-select" $fontBold="bold">{t`Category or specialty?`}</StyledLabel>
            <StyledSelect defaultValue={route.query.healthcare} name="healthcare" id="healthcare-select" onChange={handleRoute}>
              <option value="">{t`Alle`}</option>
              {translatedHealthcareOptions &&
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
