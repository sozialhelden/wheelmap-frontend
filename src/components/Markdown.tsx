import { omit } from 'lodash';
import * as React from 'react';
import unindent from './unindent';
import NotificationText from './NotificationText';
const marked = require('marked');

interface IProps extends React.HTMLProps<HTMLDivElement> {
  children: string;
  marked: (markdown: string) => string;
}

export function MarkdownDiv(props: IProps) {
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
  return marked ? <MarkdownDiv {...props} marked={marked} /> : <>{unindent(props.children)}</>;
}
