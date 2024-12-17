import {
  Button,
  DropdownMenu,
  Flex,
  Skeleton,
  Text,
  Tooltip,
} from "@radix-ui/themes";
import { signIn, signOut, useSession } from "next-auth/react";
import React from "react";
import { t } from "ttag";
import MenuItemOrButton from "./MenuItemOrButton";
import { IAutoLinkProps } from "./AutoLink";

function AuthenticatedMenuContent() {
  const { data: session } = useSession();
  const username = session?.user?.name;
  const handleSignOut = React.useCallback(() => signOut(), []);

  return (
    <Flex gap="2" align="center">
      {session?.user?.image && (
        <Tooltip content={t`You’re signed in as ${username}.`}>
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
        </Tooltip>
      )}
      <Button color="red" onClick={handleSignOut}>
        {t`Sign out`}
      </Button>
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
