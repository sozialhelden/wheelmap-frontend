import { T } from "@transifex/react";
import { bbox } from "@turf/bbox";
import { useRouter } from "next/router";
import { useCallback, useRef, useState } from "react";
import useSWR from "swr";
import { fetchJSON } from "./fetchJSON";
import { formatOSMAddress, transferCityToBbox } from "./helpers";
import { StyledDropDownListItem, StyledLabel, StyledSubLabel, StyledTextInput } from "./styles";

export function SearchBoxAutocomplete() {
  const router = useRouter();
  const [query, setQuery] = useState(router.query.city || "");
  const [isDropdownVisible, setIsDropdownVisible] = useState(false);
  const { data, error } = useSWR(query.length > 2 ? transferCityToBbox(query.toString()) : null, fetchJSON);
  const dropdownRef = useRef<HTMLUListElement>(null);
  const [focusedIndex, setFocusedIndex] = useState(-1);
  const itemRefs = useRef<Array<HTMLLIElement | null>>([]);

  if (error) return <div>{error}.</div>;

  const suggestions = data?.features || [];

  const handleSelectItem = useCallback(
    (item: any) => {
      router.replace(
        {
          pathname: router.pathname,
          query: {
            city: item.properties.name,
            bbox: bbox(item.geometry),
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
    setFocusedIndex(-1); // Reset focused index when input changes
  }, []);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      const { key } = event;

      switch (key) {
        case "ArrowDown":
          setFocusedIndex((prevIndex) => {
            const newIndex = (prevIndex + 1) % suggestions.length;
            if (itemRefs.current[newIndex]) {
              itemRefs.current[newIndex]!.scrollIntoView({ block: "nearest" });
            }
            return newIndex;
          });
          break;
        case "ArrowUp":
          setFocusedIndex((prevIndex) => {
            const newIndex = (prevIndex - 1 + suggestions.length) % suggestions.length;
            if (itemRefs.current[newIndex]) {
              itemRefs.current[newIndex]!.scrollIntoView({ block: "nearest" });
            }
            return newIndex;
          });
          break;
        case "Enter":
          if (focusedIndex >= 0 && focusedIndex < suggestions.length) {
            handleSelectItem(suggestions[focusedIndex]);
          }
          break;
        case "Escape":
          setIsDropdownVisible(false);
          break;
        default:
          break;
      }
    },
    [suggestions, focusedIndex, handleSelectItem]
  );

  return (
    <fieldset>
      <StyledLabel htmlFor="city" $fontBold="bold">
        {<T _str={`Where?`} />}
      </StyledLabel>
      <StyledTextInput type="text" value={query} name="city" id="city" onChange={handleInputChange} onKeyDown={handleKeyDown} aria-autocomplete="list" aria-controls="autocomplete-options" aria-expanded={isDropdownVisible} />
      {isDropdownVisible && suggestions.length > 0 && (
        <StyledDropDownListItem role="listbox" id="autocomplete-options" ref={dropdownRef}>
          {suggestions.map((item: any, index: number) => (
            <li
              key={index}
              role="option"
              aria-selected={focusedIndex === index}
              tabIndex={0}
              onClick={() => handleSelectItem(item)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleSelectItem(item);
                if (e.key === "Escape") setIsDropdownVisible(false);
              }}
              style={{ backgroundColor: focusedIndex === index ? "#bde4ff" : "transparent" }}
              ref={(el) => (itemRefs.current[index] = el)}
            >
              {formatOSMAddress(item.properties)}
            </li>
          ))}
        </StyledDropDownListItem>
      )}
      <StyledSubLabel>
        <T _str="Enter a location or region name." />
      </StyledSubLabel>
    </fieldset>
  );
}
