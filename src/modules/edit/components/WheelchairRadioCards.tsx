import { Flex, RadioCards, Text } from "@radix-ui/themes";
import React from "react";
import { t } from "@transifex/native";
import AccessibleIconMarker from "~/modules/map/components/AccessibleIconMarker";
import type { CategoryProperties } from "@sozialhelden/core";
import type { YesNoLimitedUnknown } from "~/needs-refactoring/lib/model/ac/Feature";

type Props = {
  category: CategoryProperties;
  onSelect: (value: YesNoLimitedUnknown) => void;
  defaultValue: string;
};

const WheelchairRadioCards = ({ category, onSelect, defaultValue }: Props) => {
  return (
    <RadioCards.Root defaultValue={defaultValue} variant="classic">
      <Flex direction="column" gap="1" width="100%">
        <RadioCards.Item
          value="yes"
          onClick={() => {
            onSelect("yes");
          }}
          style={{ backgroundColor: "var(--green-4)" }}
        >
          <Flex direction="column" width="100%">
            <Flex direction="row" gap="2">
              <AccessibleIconMarker
                accessibilityGrade="good"
                category={category.id}
                width="30"
                height="30"
              />
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
          value="limited"
          onClick={() => {
            onSelect("limited");
          }}
          style={{ backgroundColor: "var(--orange-7)" }}
        >
          <Flex direction="column" width="100%">
            <Flex direction="row" gap="2">
              <AccessibleIconMarker
                accessibilityGrade="mediocre"
                category={category.id}
                width="30"
                height="30"
              />
              <Text weight="bold" size="3" color="orange">
                {t("Partially")}
              </Text>
            </Flex>
            <Text>
              {" "}
              {t(
                "Entrance has one step with max. 3 inches height, most rooms are without steps",
              )}
            </Text>
          </Flex>
        </RadioCards.Item>

        <RadioCards.Item
          value="no"
          onClick={() => {
            onSelect("no");
          }}
          style={{ backgroundColor: "var(--red-8)" }}
        >
          <Flex direction="column" width="100%" justify="center">
            <Flex direction="row" gap="2">
              <AccessibleIconMarker
                accessibilityGrade="bad"
                category={category.id}
                width="30"
                height="30"
              />
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
export default WheelchairRadioCards;
