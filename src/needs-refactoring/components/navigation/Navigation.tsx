import { DropdownMenu, Flex, IconButton, Theme } from "@radix-ui/themes";
import { supportedLanguageTagsOptions } from "@sozialhelden/core";
import { t } from "@transifex/native";
import { Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { useExpertMode } from "~/hooks/useExpertMode";
import { useI18n } from "~/modules/i18n/hooks/useI18n";
import AppLink from "~/needs-refactoring/components/navigation/AppLink";
import type { TranslatedAppLink } from "~/needs-refactoring/lib/useAppLink";
import { useNavigation } from "~/needs-refactoring/lib/useNavigation";
import DarkModeToggle from "./DarkModeToggle";

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

export default function Navigation() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isExpertMode } = useExpertMode();

  useEffect(() => setIsOpen(false), [pathName]);

  const { primaryLink, linksInDropdownMenu } = useNavigation();

  const menuLinkElements = useMemo(
    () =>
      filterExpertModeLinks(linksInDropdownMenu, isExpertMode).map(
        (appLink) => <AppLink asMenuItem {...appLink} key={appLink._id} />,
      ),
    [linksInDropdownMenu, isExpertMode],
  );

  const { languageLabel, setLanguageTag } = useI18n();

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
          {isExpertMode && <DropdownMenu.Separator />}
          {menuLinkElements}
        </DropdownMenu.Content>
      </DropdownMenu.Root>
    </Theme>
  );

  return (
    <Flex gap="4" align="center" asChild>
      <nav aria-label={t("Main")}>
        {primaryLink && <AppLink asMenuItem={false} {...primaryLink} />}
        <DarkModeToggle />
        {dropdownMenuButton}
      </nav>
    </Flex>
  );
}
