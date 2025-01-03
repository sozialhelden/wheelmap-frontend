import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu, Flex, Theme } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { t } from "ttag";
import AutoLink from "./link-types/AutoLink";
import { useAppLinks as useCurrentAppLinks } from "./useAppLinks";

export default function MainMenuLinks() {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: when pathname changes, close the main menu.
  useEffect(() => setIsOpen(false), [pathname]);

  const { linksInToolbar, linksInDropdownMenu } = useCurrentAppLinks();

  const menuLinkElements = useMemo(
    () =>
      linksInDropdownMenu.map((appLink) => (
        <AutoLink asMenuItem {...appLink} key={appLink._id} />
      )),
    [linksInDropdownMenu],
  );

  const toolbarLinkElements = useMemo(
    () =>
      linksInToolbar.map((appLink) => (
        <AutoLink asMenuItem={false} {...appLink} key={appLink._id} />
      )),
    [linksInToolbar],
  );

  const dropdownMenuButton = menuLinkElements.length > 0 && (
    <Theme radius="small">
      <DropdownMenu.Root onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>
          <Button
            variant="solid"
            color="gray"
            size="3"
            aria-label={isOpen ? t`Close menu` : t`Show menu`}
          >
            {isOpen ? (
              // biome-ignore lint/a11y/useValidAriaRole: <explanation>
              <Cross2Icon width="24" height="24" role="none" />
            ) : (
              // biome-ignore lint/a11y/useValidAriaRole: <explanation>
              <HamburgerMenuIcon width="24" height="24" role="none" />
            )}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>{menuLinkElements}</DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );

  return (
    <Flex gap="4" align="center">
      {toolbarLinkElements}
      {dropdownMenuButton}
    </Flex>
  );
}
