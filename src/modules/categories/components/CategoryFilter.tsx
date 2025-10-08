import {
  Button,
  DropdownMenu,
  ScrollArea,
  Theme,
  VisuallyHidden,
} from "@radix-ui/themes";
import { t } from "@transifex/native";
import { ChevronDown } from "lucide-react";
import { type FC, type SVGAttributes, useRef, useState } from "react";
import styled from "styled-components";
import { useCategoryFilter } from "~/modules/categories/hooks/useCategoryFilter";
import { getTopLevelCategoryList } from "~/modules/categories/utils/display";

const CategoryList = styled.menu`
  display: flex;
  gap: 0.5rem;
  padding: 0 .5rem;
  list-style: none;

    @media (max-width: 768px) {
    margin-bottom: .75rem;
  }
`;
const StyledButton = styled(Button)`
  background: var(--color-panel);
  filter: drop-shadow(0 0.05rem 0.1rem rgba(0, 0, 0, 0.2));
  white-space: nowrap;
`;

const numberOfMainCategories = 5;

export function CategoryFilter() {
  const categories = getTopLevelCategoryList();

  const mainCategories = categories.slice(0, numberOfMainCategories);
  const categoriesInMenu = categories.slice(numberOfMainCategories);

  const { filter, isFilteringActive } = useCategoryFilter();

  const dropdownTriggerRef = useRef<HTMLButtonElement>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    !isFilteringActive && (
      <ScrollArea>
        <VisuallyHidden id="category-filter-description" aria-hidden>
          {t(
            "Filter places on the map by selecting one of the following place categories:",
          )}
        </VisuallyHidden>
        <Theme asChild radius="full">
          <CategoryList
            aria-label={t("Place Category Filters")}
            aria-describedby={"category-filter-description"}
          >
            {mainCategories.map(({ id, name, icon }) => {
              const Icon = icon as FC<SVGAttributes<SVGSVGElement>>;
              return (
                <li key={id}>
                  <StyledButton
                    color="gray"
                    variant="surface"
                    highContrast
                    size="1"
                    onClick={() => filter(id)}
                  >
                    {Icon && <Icon fill="currentColor" aria-hidden />}
                    {name()}
                  </StyledButton>
                </li>
              );
            })}
            {categoriesInMenu.length > 0 && (
              <li>
                <DropdownMenu.Root
                  open={dropdownOpen}
                  onOpenChange={setDropdownOpen}
                >
                  <DropdownMenu.Trigger
                    onPointerDown={(e) => e.preventDefault()}
                    onClick={() => setDropdownOpen((o) => !o)}
                  >
                    <StyledButton
                      ref={dropdownTriggerRef}
                      color="gray"
                      variant="surface"
                      highContrast
                      size="1"
                    >
                      {t("More…")}
                      <ChevronDown size={16} aria-hidden />
                    </StyledButton>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    {categoriesInMenu.map(({ id, name, icon }) => {
                      const Icon = icon as FC<SVGAttributes<SVGSVGElement>>;
                      return (
                        <DropdownMenu.Item key={id} onClick={() => filter(id)}>
                          {Icon && <Icon fill="currentColor" aria-hidden />}
                          {name()}
                        </DropdownMenu.Item>
                      );
                    })}
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              </li>
            )}
          </CategoryList>
        </Theme>
      </ScrollArea>
    )
  );
}
