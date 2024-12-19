import {
  Combobox,
  ComboboxItem,
  ComboboxList,
  ComboboxProvider,
} from "@ariakit/react";
import * as RadixSelect from "@radix-ui/react-select";
import { matchSorter } from "match-sorter";
import { startTransition, useEffect, useMemo, useState } from "react";
import {
  CheckIcon,
  ChevronUpDownIcon,
  SearchIcon,
} from "src/components/CombinedFeaturePanel/editors/icons.tsx";
import "./style.css";
import styled, {
  createGlobalStyle,
  StyleSheetManager,
} from "styled-components";

interface PickerProps {
  placeholder: string;
  items: { label: string; value: string }[];
  onSelect: (selectedValue: string) => void;
}

const PickerStyles = createGlobalStyle`
    .select {
        display: inline-flex;
        height: 2.5rem;
        align-items: center;
        justify-content: center;
        gap: 0.25rem;
        border-radius: 0.25rem;
        background-color: white;
        padding-left: 1rem;
        padding-right: 1rem;
        color: black;
        box-shadow: 0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1);
        color-scheme: light;
    }

    .select:hover {
        background-color: #ede9fe;
    }

    @media (min-width: 640px) {
        .select {
            height: 2.25rem;
            font-size: 15px;
        }
    }

    .select-icon {
        translate: 4px 0;
    }

    .popover {
        z-index: 50;
        max-height: min(var(--radix-select-content-available-height), 336px);
        border-radius: 0.5rem;
        background-color: white;
        box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.25), 0 4px 6px -4px
        rgb(0 0 0 / 0.1);
        color-scheme: light;
    }

    .combobox-wrapper {
        position: relative;
        display: flex;
        align-items: center;
        padding: 0.25rem;
        padding-bottom: 0px;
    }

    .combobox {
        font-family: var(--font-family, 'Inter', sans-serif);
        height: 2.5rem;
        appearance: none;
        border-radius: 0.25rem;
        background-color: rgb(0 0 0 / 0.05);
        padding-right: 0.5rem;
        padding-left: 1.75rem;
        color: black;
        outline: 2px solid transparent;
        outline-offset: 2px;
    }

    .combobox::placeholder {
        color: rgb(0 0 0 / 0.6);
    }

    @media (min-width: 640px) {
        .combobox {
            height: 2.25rem;
            font-size: 15px;
        }
    }

    .combobox-icon {
        pointer-events: none;
        position: absolute;
        left: 0.625rem;
        color: rgb(0 0 0 / 0.6);
    }

    .listbox {
        overflow-y: auto;
        padding: 0.25rem;
    }

    .item {
        font-family: var(--font-family, 'Inter', sans-serif); 
        position: relative;
        display: flex;
        height: 2.5rem;
        cursor: default;
        scroll-margin-top: 0.25rem;
        scroll-margin-bottom: 0.25rem;
        align-items: center;
        border-radius: 0.25rem;
        padding-left: 1.75rem;
        padding-right: 1.75rem;
        color: black;
        outline: 2px solid transparent;
        outline-offset: 2px;
    }

    .item[data-active-item] {
        background-color: #ddd6fe;
    }

    .item[data-highlighted] {
        background-color: #ddd6fe; /* Highlighted background */
        color: black;
    }

    .item:hover {
        background-color: #ddd6fe; /* Same as data-highlighted */
        color: black;
    }


    @media (min-width: 640px) {
        .item {
            height: 2.25rem;
            font-size: 15px;
        }
    }

    .item-indicator {
        position: absolute;
        left: 0.375rem;
    }
`;

export default function Picker({ placeholder, items, onSelect }: PickerProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");
  const [searchValue, setSearchValue] = useState("");

  const matches = useMemo(() => {
    if (!searchValue) return items;
    const keys = ["label", "value"];
    const matches = matchSorter(items, searchValue, { keys });
    // Radix Select does not work if we don't render the selected item, so we
    // make sure to include it in the list of matches.
    const selectedLanguage = items.find((lang) => lang.value === value);
    if (selectedLanguage && !matches.includes(selectedLanguage)) {
      matches.push(selectedLanguage);
    }
    return matches;
  }, [searchValue, value]);

  useEffect(() => {
    if (value) {
      onSelect(value);
    }
  }, [value, onSelect]);

  return (
    <>
      <PickerStyles />

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
          <RadixSelect.Trigger aria-label="Language" className="select">
            <RadixSelect.Value placeholder="Select a language" />
            <RadixSelect.Icon className="select-icon">
              <ChevronUpDownIcon />
            </RadixSelect.Icon>
          </RadixSelect.Trigger>

          <RadixSelect.Portal>
            <RadixSelect.Content
              role="dialog"
              aria-label="Languages"
              position="popper"
              className="popover"
              sideOffset={4}
              alignOffset={-16}
            >
              <div className="combobox-wrapper">
                <div className="combobox-icon">
                  <SearchIcon />
                </div>
                <Combobox
                  autoSelect
                  placeholder={placeholder}
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
                {matches.map(({ label, value }) => (
                  <RadixSelect.Item
                    key={value}
                    value={value}
                    asChild
                    className="item"
                  >
                    <ComboboxItem>
                      <RadixSelect.ItemText>{label}</RadixSelect.ItemText>
                      <RadixSelect.ItemIndicator className="item-indicator">
                        <CheckIcon />
                      </RadixSelect.ItemIndicator>
                    </ComboboxItem>
                  </RadixSelect.Item>
                ))}
              </ComboboxList>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </ComboboxProvider>
      </RadixSelect.Root>
    </>
  );
}
