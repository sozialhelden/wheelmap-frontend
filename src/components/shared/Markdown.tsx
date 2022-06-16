import { omit } from 'lodash';
import * as React from 'react';
import unindent from './unindent';
import NotificationText from './NotificationText';
import { parse } from 'marked';

interface IProps extends React.HTMLProps<HTMLDivElement> {
  children?: string | null | false;
  marked: (markdown: string) => string;
}

export function MarkdownDiv(props: IProps) {
  if (props.children === undefined || props.children === null || props.children === false) {
    return null;
  }
  if (typeof props.children !== 'string') {
    return <NotificationText type="negative">Markdown content must be a string.</NotificationText>;
  }
  return (
    <div
      {...omit(props, 'children', 'marked')}
      dangerouslySetInnerHTML={{ __html: props.marked?.(unindent(props.children)) }}
    />
  );
}

export default function Markdown(props: React.HTMLProps<HTMLDivElement> & { children: string }) {
  return parse ? <MarkdownDiv {...props} marked={parse} /> : <>{unindent(props.children)}</>;
}
