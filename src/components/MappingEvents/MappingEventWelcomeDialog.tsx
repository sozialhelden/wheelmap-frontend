import { Dialog, Flex } from "@radix-ui/themes";
import { t } from "@transifex/native";
import Link from "next/link";
import { useRouter } from "next/router";
import * as queryString from "query-string";
import { useCallback } from "react";
import styled from "styled-components";
import { useAppContext } from "../../lib/context/AppContext";
import {
  getJoinedMappingEventData,
  getUUID,
  setJoinedMappingEventId,
  trackMappingEventMembershipChanged,
  useCurrentMappingEventId,
} from "../../lib/context/MappingEventContext";
import useDocumentSWR from "../../lib/fetchers/ac/useDocumentSWR";
import CloseButton from "../shared/CloseButton";
import { EmailInputForm } from "./EmailInputForm";

type Props = {
  mappingEventId: string;
  invitationToken: string | null;
};

export default function MappingEventWelcomeDialog({
  invitationToken,
  mappingEventId,
}: Props) {
  const EmailCollectionModeMessages = {
    required: () =>
      t(
        "To stay in touch with you, you must provide us with your email address.",
      ),
    optional: () =>
      t("To stay in touch with you, please share your email address with us."),
    disabled: () => null,
  };

  const dialogAriaLabel = t("Welcome");
  const app = useAppContext();
  const { tokenString: appToken } = app;
  const { data: mappingEvent } = useDocumentSWR({
    type: "ac:MappingEvent",
    _id: mappingEventId,
    cached: false,
  });
  const collectionMode = mappingEvent?.emailCollectionMode || "disabled";
  const emailCollectionModeMessage =
    EmailCollectionModeMessages[collectionMode]();

  // translator: Shown on the join mapping event screen, when there is no message defined by the event organizer.
  const defaultMappingEventWelcomeMessage = t("Great! Thanks for joining us.");
  const mappingEventWelcomeMessage =
    mappingEvent?.welcomeMessage || defaultMappingEventWelcomeMessage;

  const { emailAddress: lastUsedEmailAddress } = getJoinedMappingEventData();
  let queryEmailAddress: string | undefined;
  if (typeof window !== "undefined") {
    const queryObject = queryString.parse(window.location.search);
    queryEmailAddress = queryObject.emailAddress as string;
  }

  const router = useRouter();
  const { mutate: mutateMappingEventId } = useCurrentMappingEventId();
  const userUUID = getUUID();
  const joinMappingEvent = useCallback(
    (emailAddress?: string) => {
      setJoinedMappingEventId(mappingEventId);
      trackMappingEventMembershipChanged({
        userUUID,
        app,
        reason: "button",
        joinedMappingEvent: mappingEvent,
        emailAddress,
      });
      mutateMappingEventId(null);
      router.push("/", undefined, { shallow: true });
    },
    [mappingEvent, userUUID, mutateMappingEventId, router, app, mappingEventId],
  );

  return (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Title>{mappingEvent?.name}</Dialog.Title>

        <Dialog.Description>{dialogAriaLabel}</Dialog.Description>

        <Link href="/" legacyBehavior>
          <CloseButton />
        </Link>
        <p id="mapping-event-welcome-message">{mappingEventWelcomeMessage}</p>
        {!invitationToken && <p>{emailCollectionModeMessage}</p>}
        <EmailInputForm
          initialEmailAddress={queryEmailAddress || lastUsedEmailAddress}
          collectionMode={collectionMode}
          invitationToken={invitationToken}
          onSubmit={joinMappingEvent}
        />
      </Dialog.Content>
    </Dialog.Root>
  );
}
