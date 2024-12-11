import type Link from "next/link";
import type { ComponentProps } from "react";
import { AppStateLink } from "../AppStateLink";
import { Button, DropdownMenu } from "@radix-ui/themes";

export default function AppLink(props: ComponentProps<typeof Link> & { buttonProps?: ComponentProps<typeof Button>}) {
  const { buttonProps, children } = props

  return <DropdownMenu.Item asChild>
    <AppStateLink {...props}>
      {children}
    </AppStateLink>
  </DropdownMenu.Item>
}