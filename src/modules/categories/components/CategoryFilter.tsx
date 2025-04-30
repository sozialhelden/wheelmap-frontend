import { Button, DropdownMenu, ScrollArea, Theme } from "@radix-ui/themes";
import { t } from "@transifex/native";
import styled from "styled-components";
import { useCategoryFilter } from "~/modules/categories/contexts/CategoryFilterContext";
import { getCategoryList } from "~/modules/categories/utils/display";
import { ChevronDown } from "lucide-react";

const Container = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0 .5rem;
  @media (max-width: 768px) {
    margin-bottom: .75rem;
  }
`;
const StyledButton = styled(Button)`
  background: var(--color-panel);
  filter: drop-shadow(0 0.05rem 0.1rem rgba(0, 0, 0, 0.2));
`;

const numberOfMainCategories = 5;

export function CategoryFilter() {
  const categories = getCategoryList();

  const mainCategories = categories.slice(0, numberOfMainCategories);
  const categoriesInMenu = categories.slice(numberOfMainCategories);

  const { filter, isFilteringActive } = useCategoryFilter();

  return (
    !isFilteringActive && (
      <ScrollArea>
        <Theme asChild radius="full">
          <Container>
            {mainCategories.map(({ id, name, iconComponent: Icon }) => (
              <StyledButton
                color="gray"
                variant="surface"
                highContrast
                size="1"
                key={id}
                onClick={() => filter(id)}
              >
                {Icon && <Icon aria-hidden />}
                {name()}
              </StyledButton>
            ))}
            {categoriesInMenu.length > 0 && (
              <DropdownMenu.Root>
                <DropdownMenu.Trigger>
                  <StyledButton
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
                  {categoriesInMenu.map(({ id, name, iconComponent: Icon }) => (
                    <DropdownMenu.Item key={id} onClick={() => filter(id)}>
                      {Icon && <Icon aria-hidden />}
                      {name()}
                    </DropdownMenu.Item>
                  ))}
                </DropdownMenu.Content>
              </DropdownMenu.Root>
            )}
          </Container>
        </Theme>
      </ScrollArea>
    )
  );
}
