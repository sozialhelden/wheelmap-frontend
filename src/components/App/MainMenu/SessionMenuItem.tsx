import { signIn, signOut, useSession } from "next-auth/react";
import { t } from "ttag";
import { UserIcon } from "../../icons/ui-elements";
import { Box, Button, DropdownMenu, Flex, Spinner, Text } from "@radix-ui/themes";
import React from "react";

function AuthenticatedMenuContent() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const handleSignOut = React.useCallback(() => signOut(), []);

  return (
    <>
      <DropdownMenu.Label>
        <Flex gap="2" align="center">
          {!session?.user?.image && <UserIcon />}
          {session?.user?.image && (
            <img
              src={session?.user.image}
              alt={t`${username}'s avatar`}
              style={{
                maxWidth: "32px",
                maxHeight: "32px",
                borderRadius: "16px",
                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.1)",
              }}
            />
          )}
          <Text>{t`You’re signed in as ${username}.`}</Text>
        </Flex>
      </DropdownMenu.Label>
      <Button color="red" onClick={handleSignOut}>
        {t`Sign out`}
      </Button>
    </>
  );
}

function NonAuthenticatedMenuContent() {
  const handleSignIn = React.useCallback(() => signIn("osm"), []);
  return <Button onClick={handleSignIn}>{t`Sign in with OpenStreetMap`}</Button>;
}

function LoadingMenuContent() {
  return (
    <Box>
      <Spinner />
    </Box>
  );
}

export default function SessionMenuItem() {
  const { status } = useSession();
  return {
    loading: <LoadingMenuContent />,
    authenticated: <AuthenticatedMenuContent />,
    unauthenticated: <NonAuthenticatedMenuContent />,
  }[status];
}
