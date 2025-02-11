import { ExclamationTriangleIcon } from "@radix-ui/react-icons";
import { Callout } from "@radix-ui/themes";
import { omit } from "lodash";
import { type MarkedOptions, parse, parseInline } from "marked";
import type * as React from "react";
import { t } from "ttag";
import unindent from "../../lib/util/strings/unindent";

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
      <Callout.Root color="gray" variant="soft">
        <Callout.Icon>
          <ExclamationTriangleIcon />
        </Callout.Icon>
        <Callout.Text>{t`Markdown must be a string.`}</Callout.Text>
      </Callout.Root>
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
