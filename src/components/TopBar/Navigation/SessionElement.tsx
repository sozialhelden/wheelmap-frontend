import { Box, Button, Flex, Popover, Skeleton, Text } from "@radix-ui/themes";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { t } from "ttag";
import Markdown from "../../shared/Markdown";
import type { IAutoLinkProps } from "./AppLink";
import MenuItemOrButton from "./MenuItemOrButton";

function AuthenticatedMenuContent() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const handleSignOut = React.useCallback(() => signOut(), []);
  const signInNotice = t`
    You’re signed in with OpenStreetMap.

    Edits you make will be attributed to your OpenStreetMap account **${username}**.
  `;

  const popoverContent = (
    <Box maxWidth={"60vw"}>
      <Text as="p">
        <Markdown>{signInNotice}</Markdown>
      </Text>
      <Button color="red" onClick={handleSignOut}>
        {t`Sign out`}
      </Button>
    </Box>
  );

  return (
    <Flex gap="2" align="center">
      {session?.user?.image && (
        <Popover.Root>
          <Popover.Trigger>
            <img
              src={session.user.image}
              alt={t`Your avatar`}
              width="32"
              height="32"
              style={{ borderRadius: "50%" }}
            />
          </Popover.Trigger>
          <Popover.Content sideOffset={5} side="bottom" align="start">
            {popoverContent}
          </Popover.Content>
        </Popover.Root>
      )}
    </Flex>
  );
}

function NonAuthenticatedMenuContent() {
  const handleSignIn = React.useCallback(() => signIn("osm"), []);
  return <Button onClick={handleSignIn}>{t`Sign in`}</Button>;
}

function LoadingMenuContent() {
  return <Skeleton width="50px" height="1em" />;
}

/**
 * A sign-in/sign-out button that changes its content based on the session status.
 */
export default function SessionElement(props: IAutoLinkProps) {
  const { status } = useSession();
  const children = {
    loading: <LoadingMenuContent />,
    authenticated: <AuthenticatedMenuContent />,
    unauthenticated: <NonAuthenticatedMenuContent />,
  }[status];

  return <MenuItemOrButton {...props}>{children}</MenuItemOrButton>;
}
