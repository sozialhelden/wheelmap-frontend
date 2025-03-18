import { Cross2Icon, HamburgerMenuIcon } from "@radix-ui/react-icons";
import { DropdownMenu, Flex, IconButton, Theme } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { SecondaryButton } from "~/components/shared/Buttons";
import type { TranslatedAppLink } from "~/lib/useAppLink";
import { useExpertMode } from "~/lib/useExpertMode";
import { useNavigation } from "~/lib/useNavigation";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import {
  supportedLanguageTags,
  supportedLanguageTagsOptions,
} from "~/modules/i18n/i18n";
import AppLink from "./Navigation/AppLink";

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

const FlexListItem = styled.li`
    display: flex;
`;

export default function Navigation() {
  const router = useRouter();
  const { pathname } = router;
  const [isOpen, setIsOpen] = useState(false);
  const { isExpertMode } = useExpertMode();

  // biome-ignore lint/correctness/useExhaustiveDependencies: when pathname changes, close the main menu.
  useEffect(() => setIsOpen(false), [pathname]);

  const { linksInToolbar, linksInDropdownMenu } = useNavigation();

  const menuLinkElements = useMemo(
    () =>
      filterExpertModeLinks(linksInDropdownMenu, isExpertMode).map(
        (appLink) => <AppLink asMenuItem {...appLink} key={appLink._id} />,
      ),
    [linksInDropdownMenu, isExpertMode],
  );

  const toolbarLinkElements = useMemo(
    () =>
      filterExpertModeLinks(linksInToolbar, isExpertMode).map((appLink) => (
        <FlexListItem key={appLink._id}>
          <AppLink asMenuItem={false} {...appLink} />
        </FlexListItem>
      )),
    [linksInToolbar, isExpertMode],
  );

  const { languageLabel, setLanguageTag } = useI18nContext();

  const dropdownMenuButton = menuLinkElements.length > 0 && (
    <Theme radius="small">
      <DropdownMenu.Root onOpenChange={setIsOpen}>
        <DropdownMenu.Trigger>
          <IconButton
            variant="soft"
            color="gray"
            size="3"
            aria-label={isOpen ? t("Close menu") : t("Show menu")}
          >
            {isOpen ? (
              <Cross2Icon width="24" height="24" aria-hidden="true" />
            ) : (
              <HamburgerMenuIcon width="24" height="24" aria-hidden="true" />
            )}
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {isExpertMode && (
            <>
              <DropdownMenu.Sub>
                <DropdownMenu.SubTrigger>
                  {languageLabel}
                </DropdownMenu.SubTrigger>
                <DropdownMenu.SubContent>
                  {supportedLanguageTagsOptions.map(({ value, label }) => (
                    <DropdownMenu.Item
                      onClick={() => setLanguageTag(value)}
                      key={value}
                    >
                      {label}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.SubContent>
              </DropdownMenu.Sub>
              <DropdownMenu.Separator />
            </>
          )}
          {menuLinkElements}
        </DropdownMenu.Content>
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
