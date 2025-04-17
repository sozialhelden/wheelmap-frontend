import type * as React from "react";
import styled from "styled-components";

interface IProps {
  className?: string;
  type: "positive" | "negative";
  children: React.ReactNode;
  /**
   * Hint to let screen readers know how to speak the notification.
   */
  isImportant?: boolean;
}

function UnstyledNotificationText(props: IProps) {
  const liveAttribute = props.isImportant ? "assertive" : "polite";
  return (
    <section className={props.className} role="alert" aria-live={liveAttribute}>
      {props.children}
    </section>
  );
}

const NotificationText = styled(UnstyledNotificationText)`
  padding: 1rem;
  max-width: 30rem;
  border-radius: 4px;
`;

export default NotificationText;
