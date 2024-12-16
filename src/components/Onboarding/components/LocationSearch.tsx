import { FC, startTransition, useContext, useMemo, useRef, useState } from "react";
import useSWR from "swr";
import type { FeatureCollection, Point } from "geojson";
import { center as turfCenter } from "@turf/turf";
import fetchPhotonFeatures, {
  type PhotonResultFeature,
} from "../../../lib/fetchers/fetchPhotonFeatures";
import { SearchConfirmText, SearchSkipText } from "../language";
import CountryContext from "../../../lib/context/CountryContext";
import fetchCountryGeometry from "../../../lib/fetchers/fetchCountryGeometry";
import { useCurrentLanguageTagStrings } from "../../../lib/context/LanguageTagContext";
import { Button, ChevronDownIcon, DropdownMenu } from "@radix-ui/themes";
import { t } from "ttag";
import {
  Combobox,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixSelect from "@radix-ui/react-select";
import { MagnifyingGlassIcon } from "@radix-ui/react-icons";


export const LocationSearch: FC<{
  onUserSelection: (selection?: PhotonResultFeature) => unknown;
}> = ({ onUserSelection }) => {
  const comboboxRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [value, setValue] = useState("");

  const region = useContext(CountryContext);
  const { data: regionGeometry } = useSWR<FeatureCollection>(
    {},
    fetchCountryGeometry,
  );
  const bias = useMemo(() => {
    if (!regionGeometry) {
      return undefined;
    }

    const location = regionGeometry.features.find(
      (x) => x.properties?.["ISO3166-1"] === region,
    );

    let center: Point | undefined;
    if (location) {
      if ("centroid" in location) {
        center = location.centroid as Point;
      } else {
        center = turfCenter(location).geometry;
      }
    }

    const computedBias = {
      lon: center?.coordinates[0].toString(),
      lat: center?.coordinates[1].toString(),
      zoom: "5",
      location_bias_scale: "1.0",
    } as const;
    return computedBias;
  }, [regionGeometry, region]);

  const languageTag = useCurrentLanguageTagStrings()?.[0] || "en";
  const { data } = useSWR(
    {
      languageTag,
      query: searchValue,
      additionalQueryParameters: { layer: "city", ...bias },
    },
    fetchPhotonFeatures,
  );
  const filteredData: ({ key: string } & PhotonResultFeature)[] = useMemo(() => {
    if (!data) {
      return [
        {
          key: "Tokyo / Japan",
          properties: {
            name: "Tokyo",
            country: "Japan",
          },
        },
      ];
    }
    const bucket: ({ key: string } & PhotonResultFeature)[] = [];
    for (let i = 0; i < data.features.length; i += 1) {
      const entry = data.features[i];
      if (!entry.properties) {
        continue;
      }
      const key = `${entry.properties.city ?? entry.properties.name} / ${entry.properties.country}`;
      if (bucket.some((x) => x.key === key)) {
        continue;
      }
      bucket.push({
        key,
        ...entry,
      });
    }
    return bucket;
  }, [data]);

  return (
    <>
      <RadixSelect.Root
        value={value}
        onValueChange={setValue}
        open={open}
        onOpenChange={setOpen}
      >
        <ComboboxProvider
          open={open}
          setOpen={setOpen}
          resetValueOnHide
          includesBaseElement={false}
          setValue={(value) => {
            startTransition(() => {
              setSearchValue(value);
            });
          }}
        >
          <ComboboxLabel className="label">{t`Enter a location name`}</ComboboxLabel>

          <RadixSelect.Trigger aria-label="Language" className="select">
            <RadixSelect.Value placeholder="Select a language" />
            <RadixSelect.Icon className="select-icon">
              <ChevronDownIcon />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>

          <RadixSelect.Content
            // biome-ignore lint/a11y/useSemanticElements: <explanation>
            role="dialog"
            aria-label="Languages"
            position="popper"
            className="popover"
            sideOffset={4}
            alignOffset={-16}
          >
            <div className="combobox-wrapper">
              <div className="combobox-icon">
                <MagnifyingGlassIcon />
              </div>
              <Combobox
                autoSelect
                placeholder="Search places"
                className="combobox"
                // Ariakit's Combobox manually triggers a blur event on virtually
                // blurred items, making them work as if they had actual DOM
                // focus. These blur events might happen after the corresponding
                // focus events in the capture phase, leading Radix Select to
                // close the popover. This happens because Radix Select relies on
                // the order of these captured events to discern if the focus was
                // outside the element. Since we don't have access to the
                // onInteractOutside prop in the Radix SelectContent component to
                // stop this behavior, we can turn off Ariakit's behavior here.
                onBlurCapture={(event) => {
                  event.preventDefault();
                  event.stopPropagation();
                }}
              />
            </div>
            <ComboboxList className="listbox">
              {filteredData.map((match) => (
                <RadixSelect.Item
                  key={match.key}
                  value={match.key}
                  asChild
                  className="item"
                >
                  <ComboboxItem>
                    <RadixSelect.ItemText>{match.properties.name}</RadixSelect.ItemText>
                  </ComboboxItem>
                </RadixSelect.Item>
              ))}
            </ComboboxList>
          </RadixSelect.Content>
        </ComboboxProvider>
      </RadixSelect.Root>
      <Button
        size="3"
        onClick={() => {
          onUserSelection(filteredData.find((x) => x.key === value));
        }}
      >
        {value ? SearchConfirmText : SearchSkipText}
        {value}
      </Button>
    </>
  );
};
