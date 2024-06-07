// @ts-ignore
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { t } from "ttag";
import { fetchJSON } from "./fetchJSON";
import { formatOSMAddress, transferCityToBbox } from "./helpers";
import { StyledDropDownListItem, StyledLabel, StyledSubLabel, StyledTextInput } from "./styles";

export function SearchBoxAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.city || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { data, error } = useSWR(query.length > 2 ? transferCityToBbox(query.toString()) : null, fetchJSON);
  const dropdownRef = useRef(null);

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

  const handleKeyDown = useCallback((event: React.KeyboardEvent<HTMLInputElement>) => {
    const { key } = event;
    if (key === "Escape") setIsDropdownVisible(false);
  }, []);

  return (
    <>
      <StyledLabel htmlFor="city" $fontBold="bold">
        {t`Where?`}
        <StyledSubLabel>{t`Enter a location or district`}</StyledSubLabel>
      </StyledLabel>
      <StyledTextInput type="text" value={query} name="city" id="city" onChange={handleInputChange} onKeyDown={handleKeyDown} aria-autocomplete="list" aria-controls="autocomplete-options" aria-expanded={isDropdownVisible} ref={dropdownRef} />
      {isDropdownVisible && suggestions.length > 0 && (
        <StyledDropDownListItem role="listbox" id="autocomplete-options">
          {suggestions.map((item: any, index: number) => (
            <li
              key={index}
              role="option"
              aria-selected={false}
              tabIndex={0}
              onClick={() => handleSelectItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelectItem(item);
                if (e.key === "Escape") setIsDropdownVisible(false);
              }}
            >
              {formatOSMAddress(item.properties)}
            </li>
          ))}
        </StyledDropDownListItem>
      )}
    </>
  );
}
