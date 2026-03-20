import { AlertDialog, Box, Button, Flex, Spinner } from "@radix-ui/themes";
import type { ComponentProps, FC, ReactNode } from "react";
import styled from "styled-components";
import StyledMarkdown from "~/needs-refactoring/components/shared/StyledMarkdown";

type ButtonProps = {
  label: string;
  onClick: () => unknown;
  type: "action" | "cancel";
  variant?: ComponentProps<typeof Button>["variant"];
  className?: string;
  loading?: boolean;
};

type Props = {
  title: ReactNode;
  description: string;
  icon: ReactNode;
  actions: ButtonProps[];
};

const IconBadge = styled(Box)`
  display: inline-flex;
  padding: 5rem;
  border-radius: 2rem;
  background-color: var(--blue-3);
  color: var(--accent-11);
`;

export const LocationDialogComponent: FC<Props> = ({
  title,
  description,
  icon,
  actions,
}) => {
  const primaryActionIndex = actions.findIndex(
    (action) => action.type === "action",
  );
  return (
    <Box p="4">
      <AlertDialog.Title align="center" mt="3">
        {title}
      </AlertDialog.Title>

      <Flex justify="center" m="6">
        <IconBadge>{icon}</IconBadge>
      </Flex>

      <AlertDialog.Description align="center">
        <StyledMarkdown>{description}</StyledMarkdown>
      </AlertDialog.Description>

      <Flex gap="3" mt="4" justify="end" direction="column">
        {actions.map((action, index) => {
          const ButtonComponent =
            action.type === "cancel" ? AlertDialog.Cancel : AlertDialog.Action;

          return (
            <ButtonComponent key={action.label}>
              <Button
                highContrast
                size="3"
                onClick={action.onClick}
                variant={action.variant}
                className={action.className}
                autoFocus={index === primaryActionIndex}
              >
                {action.label}
                {action.loading && <Spinner />}
              </Button>
            </ButtonComponent>
          );
        })}
      </Flex>
    </Box>
  );
};
