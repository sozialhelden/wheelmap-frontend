import { Pencil1Icon } from "@radix-ui/react-icons";
import { IconButton } from "@radix-ui/themes";
import { DropdownMenu } from "@radix-ui/themes";
import React from "react";
import { AppStateLink } from "../../../App/AppStateLink";

function addQueryParamToURL(
  baseURL: string,
  key: string,
  value: string,
): string {
  const url = new URL(baseURL, window.location.origin);
  url.searchParams.set(key, value);
  return url.toString();
}

export function EditDropdownMenu({ editURL }: { editURL: string }) {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>
        <IconButton variant="soft" size="3">
          <Pencil1Icon width="13" height="13" />
          <DropdownMenu.TriggerIcon />
        </IconButton>
      </DropdownMenu.Trigger>

      <DropdownMenu.Content>
        <DropdownMenu.Item>
          <AppStateLink href={addQueryParamToURL(editURL, "newLang", "false")}>
            Edit this description
          </AppStateLink>
        </DropdownMenu.Item>

        <DropdownMenu.Item>
          <AppStateLink href={addQueryParamToURL(editURL, "newLang", "true")}>
            Add a description in another language
          </AppStateLink>
        </DropdownMenu.Item>
      </DropdownMenu.Content>
    </DropdownMenu.Root>
  );
}
