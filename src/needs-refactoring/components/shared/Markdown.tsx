import { omit } from "lodash";
import { type MarkedOptions, parse, parseInline } from "marked";
import type * as React from "react";
import unindent from "~/needs-refactoring/lib/util/strings/unindent";
import NotificationText from "./NotificationText";

interface IProps extends React.HTMLProps<HTMLDivElement> {
  children?: string | null | false;
  marked: typeof parse | typeof parseInline;
  options?: MarkedOptions;
}

export function MarkdownDiv(props: IProps) {
  if (
    props.children === undefined ||
    props.children === null ||
    props.children === false
  ) {
    return null;
  }
  if (typeof props.children !== "string") {
    return (
      <NotificationText type="negative">
        Markdown content must be a string.
      </NotificationText>
    );
  }

  return (
    <div
      {...omit(props, "children", "marked", "options")}
      // biome-ignore lint/security/noDangerouslySetInnerHtml: This isn't possible without setting the HTML.
      dangerouslySetInnerHTML={{
        __html: props.marked?.(unindent(props.children), props.options),
      }}
    />
  );
}

export default function Markdown(
  props: React.HTMLProps<HTMLDivElement> & {
    className?: string;
    inline?: boolean;
    children: string;
    options?: MarkedOptions;
    as?: keyof HTMLElementTagNameMap;
  },
) {
  return parse ? (
    <MarkdownDiv
      {...props}
      marked={props.inline ? parseInline : parse}
      options={props.options}
    />
  ) : (
    <>{unindent(props.children)}</>
  );
}
