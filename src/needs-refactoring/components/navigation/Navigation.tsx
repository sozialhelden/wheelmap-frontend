import { DropdownMenu, Flex, IconButton, Theme } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { CheckIcon, Menu, X } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useTheme } from "~/hooks/useTheme";
import { useI18nContext } from "~/modules/i18n/context/I18nContext";
import { supportedLanguageTagsOptions } from "~/modules/i18n/i18n";
import AppLink from "~/needs-refactoring/components/navigation/AppLink";
import type { TranslatedAppLink } from "~/needs-refactoring/lib/useAppLink";
import { useExpertMode } from "~/needs-refactoring/lib/useExpertMode";
import { useNavigation } from "~/needs-refactoring/lib/useNavigation";

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
  const { theme, setTheme } = useTheme();

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
            {isOpen ? <X aria-hidden="true" /> : <Menu aria-hidden="true" />}
          </IconButton>
        </DropdownMenu.Trigger>
        <DropdownMenu.Content>
          {isExpertMode && (
            <DropdownMenu.Sub>
              <DropdownMenu.SubTrigger>{languageLabel}</DropdownMenu.SubTrigger>
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
          )}
          <DropdownMenu.Sub>
            <DropdownMenu.SubTrigger>
              {t("Choose theme")}
            </DropdownMenu.SubTrigger>
            <DropdownMenu.SubContent>
              <DropdownMenu.Item onClick={() => setTheme("light")} key="light">
                {t("Light")}
                {theme === "light" && (
                  <CheckIcon aria-hidden="true" size={16} />
                )}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme("dark")} key="dark">
                {t("Dark")}
                {theme === "dark" && <CheckIcon aria-hidden="true" size={16} />}
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={() => setTheme("system")} key="sytem">
                {t("Auto")}
                {theme === "system" && (
                  <CheckIcon aria-hidden="true" size={16} />
                )}
              </DropdownMenu.Item>
            </DropdownMenu.SubContent>
          </DropdownMenu.Sub>
          <DropdownMenu.Separator />
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
