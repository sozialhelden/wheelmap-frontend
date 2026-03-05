import { DropdownMenu, IconButton, Theme } from "@radix-ui/themes";
import { supportedLanguageTagsOptions } from "@sozialhelden/core";
import { t } from "@transifex/native";
import { Menu, Moon, Plus, Sun, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useExpertMode } from "~/hooks/useExpertMode";
import { useTheme } from "~/hooks/useTheme";
import { useI18n } from "~/modules/i18n/hooks/useI18n";
import AppLink from "~/needs-refactoring/components/navigation/AppLink";
import type { TranslatedAppLink } from "~/needs-refactoring/lib/useAppLink";
import { useNavigation } from "~/needs-refactoring/lib/useNavigation";
import { useWindowSize } from "~/needs-refactoring/lib/util/useViewportSize";
import DarkModeToggle from "./DarkModeToggle";

const SMALL_VIEWPORT_BREAKPOINT = 1024;

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

const StyledNav = styled.nav`
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-shrink: 0;
`;

const StyledDropdownMenuContent = styled(DropdownMenu.Content)`
  --default-font-size: var(--font-size-4);
  
  & [data-radix-collection-item] {
    font-size: var(--font-size-4);
  }
`;

export default function Navigation() {
  const pathName = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const { isExpertMode } = useExpertMode();
  const { width } = useWindowSize();
  const isSmallViewport = width < SMALL_VIEWPORT_BREAKPOINT;
  const { setTheme, resolvedTheme } = useTheme();

  const isDark = resolvedTheme === "dark";
  const ThemeIcon = isDark ? Sun : Moon;

  const handleThemeToggle = () => {
    setTheme(isDark ? "light" : "dark");
  };

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
        <StyledDropdownMenuContent>
          {isSmallViewport && primaryLink && (
            <>
              <DropdownMenu.Item asChild>
                <Link href={primaryLink.url || "#"}>
                  <Plus
                    size={16}
                    aria-hidden="true"
                    style={{ marginRight: 8 }}
                  />
                  {primaryLink.label || t("Add new location")}
                </Link>
              </DropdownMenu.Item>
              <DropdownMenu.Item onClick={handleThemeToggle}>
                <ThemeIcon
                  size={16}
                  aria-hidden="true"
                  style={{ marginRight: 8 }}
                />
                {t("Change theme")}
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
            </>
          )}
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
        </StyledDropdownMenuContent>
      </DropdownMenu.Root>
    </Theme>
  );

  // Only show primary link and dark mode toggle outside the menu on large viewports
  const primaryLinkElement =
    primaryLink && !isSmallViewport ? (
      <AppLink asMenuItem={false} {...primaryLink} />
    ) : null;

  return (
    <StyledNav aria-label={t("Main")}>
      {primaryLinkElement}
      {!isSmallViewport && <DarkModeToggle />}
      {dropdownMenuButton}
    </StyledNav>
  );
}
