import { Button, Flex, Text, Theme, Tooltip } from "@radix-ui/themes";
import { type Ref, forwardRef } from "react";
import styled from "styled-components";
import { t } from "ttag";
import NeedsIcon from "~/domains/needs/components/icons/NeedsIcon";
import { useNeeds } from "~/domains/needs/hooks/useNeeds";

const StyledButton = styled(Button)`
  max-width: 100%;
  line-height: 1.1;
  position: relative;
  padding-left: .4rem;
  padding-right: .4rem;
`;
const IconWrapper = styled.span`
  background: var(--accent-9);
  width: 2rem;
  height: 2rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 9999px;
  flex-shrink: 0;
`;
const NumberBadge = styled.span`
  position: absolute;
  top: -.25rem;
  right: -.3rem;
  font-weight: bold;
  color: var(--gray-12);
  background: var(--gray-7);
  padding: .06rem .18rem;
  min-width: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: var(--radius-3);
  font-size: .85rem;
`;

export const NeedsButton = forwardRef(function NeedsButton(
  props,
  ref: Ref<HTMLButtonElement>,
) {
  const { needs: needsMap } = useNeeds();

  const needs = Object.values(needsMap);
  const needsWithIcon = needs.filter(({ icon }) => Boolean(icon));

  return (
    <Theme radius="full" asChild>
      <StyledButton
        {...props}
        ref={ref}
        variant="soft"
        size="3"
        aria-label={
          needs.length === 0
            ? t`Select your needs`
            : t`You have ${needs.length} needs selected: ${needs.map(({ label }) => label()).join(", ")}`
        }
      >
        {needs.length > 0 && (
          <NumberBadge aria-hidden>
            <span>{needs.length}</span>
          </NumberBadge>
        )}
        {needs.length === 0 && <Text ml="3">{t`What do you need?`}</Text>}
        {needsWithIcon.length > 0 && (
          <Flex gap="2" ml="3" aria-hidden>
            {needsWithIcon.map(({ label, icon: Icon }) => (
              <Tooltip content={`${label()}`} key={label()}>
                {/* @ts-ignore */}
                <Icon />
              </Tooltip>
            ))}
          </Flex>
        )}
        <IconWrapper aria-hidden>
          <NeedsIcon />
        </IconWrapper>
      </StyledButton>
    </Theme>
  );
});
