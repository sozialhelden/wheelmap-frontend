import React from "react";
import { Flex, RadioCards, Text } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { ToiletStatusNotAccessible } from "~/needs-refactoring/components/icons/accessibility";
import ToiletStatusAccessibleIcon from "~/needs-refactoring/components/icons/accessibility/ToiletStatusAccessible";
import type { YesNoUnknown } from "~/needs-refactoring/lib/model/ac/Feature";

type Props = {
  onSelect: (value: YesNoUnknown) => void;
  defaultValue: string | undefined;
};

const ToiletRadioCards = ({ onSelect, defaultValue }: Props) => {
  return (
    <RadioCards.Root
      defaultValue={defaultValue}
      variant="classic"
      onValueChange={onSelect}
    >
      <Flex direction="column" gap="1" width="100%">
        <RadioCards.Item
          value="yes"
          style={{ backgroundColor: "var(--green-4)" }}
          data-testid="yes-item"
        >
          <Flex direction="column" width="100%">
            <Flex direction="row" gap="2">
              <ToiletStatusAccessibleIcon />
              <Text weight="bold" size="3" color="grass">
                {t("Fully")}
              </Text>
            </Flex>
            <Text>
              {t(
                "Entrance has no steps, and all rooms are accessible without steps.",
              )}
            </Text>
          </Flex>
        </RadioCards.Item>

        <RadioCards.Item
          value="no"
          style={{ backgroundColor: "var(--red-8)" }}
          data-testid="no-item"
        >
          <Flex direction="column" width="100%" justify="center">
            <Flex direction="row" gap="2">
              <ToiletStatusNotAccessible />
              <Text weight="bold" size="3" color="ruby">
                {t("Not at all")}
              </Text>
            </Flex>
            <Text>
              {t(
                "Entrance has a high step or several steps, none of the rooms are accessible.",
              )}
            </Text>
          </Flex>
        </RadioCards.Item>
      </Flex>
    </RadioCards.Root>
  );
};
export default ToiletRadioCards;
