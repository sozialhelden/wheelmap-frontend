import { useRouter } from "next/router";
import { useCallback, useState } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { fetcher, transferCityToBbox } from "./helpers";
import { StyledDropDownListItem, StyledTextInput } from "./styles";

export function SearchBoxAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.city || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { data, error } = useSWR(query.length > 2 ? transferCityToBbox(query.toString()) : null, fetcher);

  if (error) return <div>{error}.</div>;

  const suggestions = data?.features || [];

  const handleSelectItem = useCallback(
    (item: any) => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            city: item.properties.name,
            bbox: item.properties.extent,
          },
        },
        undefined,
        { shallow: true }
      );
      setIsDropdownVisible(false);
    },
    [router]
  );

  const handleInputChange = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(event.target.value);
    setIsDropdownVisible(true);
  }, []);

  const ariaOptions = {
    placeholder: t`Where?`,
    "aria-label": t`Where?`,
    "aria-autocomplete": "list" as const,
    "aria-controls": "autocomplete-options",
    "aria-expanded": isDropdownVisible,
  };
  return (
    <>
      <StyledTextInput type="text" value={query} name="city" id="city" onChange={handleInputChange} {...ariaOptions} />
      {isDropdownVisible && suggestions.length > 0 && (
        <StyledDropDownListItem>
          {suggestions.map((item: any, index: number) => (
            <li key={index} onClick={() => handleSelectItem(item)}>
              {item.properties.name}
            </li>
          ))}
        </StyledDropDownListItem>
      )}
    </>
  );
}
