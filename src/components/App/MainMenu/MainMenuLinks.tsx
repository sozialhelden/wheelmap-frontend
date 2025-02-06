import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { Button, DropdownMenu, Flex, Theme } from "@radix-ui/themes";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import { t } from "ttag";
import IAppLink from "../../../lib/model/ac/IAppLink";
import AutoLink from "./link-types/AutoLink";
import type { TranslatedAppLink } from "./translateAndInterpolateAppLink";
import { useAppLinks as useCurrentAppLinks } from "./useAppLinks";
import { useExpertMode } from "./useExpertMode";

function filterExpertModeLinks(
  links: TranslatedAppLink[],
  isExpertMode: boolean,
) {
  return links.filter((link) => {
    if (link.tags?.includes("session")) {
      return isExpertMode;
    }
    return true;
  });
}

export default function MainMenuLinks() {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);
  const { isExpertMode } = useExpertMode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: when pathname changes, close the main menu.
  useEffect(() => setIsOpen(false), [pathname]);

  const { linksInToolbar, linksInDropdownMenu } = useCurrentAppLinks();

  const menuLinkElements = useMemo(
    () =>
      filterExpertModeLinks(linksInDropdownMenu, isExpertMode).map(
        (appLink) => <AutoLink asMenuItem {...appLink} key={appLink._id} />,
      ),
    [linksInDropdownMenu, isExpertMode],
  );

  const toolbarLinkElements = useMemo(
    () =>
      filterExpertModeLinks(linksInToolbar, isExpertMode).map((appLink) => (
        <li key={appLink._id}>
          <AutoLink asMenuItem={false} {...appLink} />
        </li>
      )),
    [linksInToolbar, isExpertMode],
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
              <Cross2Icon width="24" height="24" aria-hidden="true" />
            ) : (
              <HamburgerMenuIcon width="24" height="24" aria-hidden="true" />
            )}
          </Button>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>{menuLinkElements}</DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );

  return (
    <Flex gap="4" align="center" asChild>
      <nav>
        <Flex gap="4" align="center" direction={"row"} asChild>
          <ul>{toolbarLinkElements}</ul>
        </Flex>
        {dropdownMenuButton}
      </nav>
    </Flex>
  );
}
