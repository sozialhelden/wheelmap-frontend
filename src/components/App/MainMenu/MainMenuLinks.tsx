import * as React from "react";
import { useAppLinks } from "./useAppLinks";
import {
  Button,
  DropdownMenu,
  Flex,
  Theme,
} from "@radix-ui/themes";
import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { useRouter } from "next/router";
import { t } from "ttag";
import { AutoLink } from "./AutoLink";
import { useWindowSize } from "../../../lib/util/useViewportSize";

export default function MainMenuLinks() {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = React.useState(false);

  // biome-ignore lint/correctness/useExhaustiveDependencies: when pathname changes, the effect must be triggered.
  React.useEffect(() => {
    setIsOpen(false);
  }, [pathname]);

  const menuButton = (
    <Button variant="solid" color="gray" size="3" aria-label={isOpen ? t`Close menu` : t`Show menu`}>
      {isOpen ? (
        <Cross2Icon width="24" height="24" />
      ) : (
        <HamburgerMenuIcon width="24" height="24" />
      )}
    </Button>
  );

  const windowSize = useWindowSize();
  const appLinks = useAppLinks();
  const isBigViewport = windowSize.width >= 1024;

  // We show some links outside, and some inside the menu.
  // First, we sort the links into categories:
  const alwaysVisible = appLinks.filter(l => l.importance === "alwaysVisible");
  const advertisedIfPossible = appLinks.filter(l => !l.importance || l.importance === "advertisedIfPossible");
  const insignificant = appLinks.filter(l => l.importance === "insignificant");

  const shownInMenu = [...isBigViewport ? [] : advertisedIfPossible, ...insignificant].sort((a, b) => (a.order || 0) - (b.order || 0));
  const shownInToolbar = [...isBigViewport ? advertisedIfPossible : [], ...alwaysVisible].sort((a, b) => (a.order || 0) - (b.order || 0));

  const appLinksPopover = (
    <Theme radius="small">
      <DropdownMenu.Root onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>{menuButton}</DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {shownInMenu.map((appLink) => <AutoLink asMenuItem {...appLink} key={appLink._id}/>)}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );
  return <Flex gap="4" align="center">
    {shownInToolbar.map(
      (appLink) =>
        <AutoLink asMenuItem={false} key={appLink._id} {...appLink} />)}
    {appLinksPopover}
  </Flex>;
}
