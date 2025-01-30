import {Select} from "@radix-ui/themes";
import * as React from "react";
import {useEffect, useState} from "react";

interface SearchableSelectProps {
  selectPlaceholder: string;
  items: { label: string; value: string }[];
  onSelect: (selectedValue: string) => void;
  ariaLabelForTrigger: string;
  ariaLabelForContent: string;
}

/* If the language of the browser appears in the picker and at the same time
 * editing is forbidden as long as the language was not selected, the user will be confused
 * in case the preselected language matches their intended language and they don not change
 * the picker value. This is why there is a placeholder here instead of a default value.
 * */

export default function SearchableSelect({
  selectPlaceholder,
  items,
  onSelect,
  ariaLabelForTrigger,
  ariaLabelForContent
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState("");

  useEffect(() => {
    if (value) {
      onSelect(value);
    }
  }, [value, onSelect]);


  return (
    <>

      <Select.Root
        value={value}
        onValueChange={setValue}
        //open={open}
        onOpenChange={setOpen}
      >
          <Select.Trigger
            aria-label={ariaLabelForTrigger}
            className="select"
            placeholder={selectPlaceholder}
            variant="soft">
          </Select.Trigger>

        {/*TODO: make select searchable: https://ariakit.org/examples/combobox-radix-select*/}

            <Select.Content
              aria-label={ariaLabelForContent}
            >
              {items.map(({label, value}) => (
                <Select.Item key={value} value={value}>
                  {label}
                </Select.Item>
              ))}

            </Select.Content>
      </Select.Root>
    </>
  );
}
