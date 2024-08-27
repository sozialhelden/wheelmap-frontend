import { omit } from 'lodash'
import { MarkedOptions, parse, parseInline } from 'marked'
import * as React from 'react'
import unindent from '../../lib/util/strings/unindent'
import NotificationText from './NotificationText'

interface IProps extends React.HTMLProps<HTMLDivElement> {
  children?: string | null | false;
  marked: typeof parse | typeof parseInline;
  options?: MarkedOptions;
  element?: keyof HTMLElementTagNameMap;
}

export function MarkdownDiv(props: IProps) {
  if (props.children === undefined || props.children === null || props.children === false) {
    return null
  }
  if (typeof props.children !== 'string') {
    return <NotificationText type="negative">Markdown content must be a string.</NotificationText>
  }
  const Element = props.element || 'div'
  return (
    <Element
      {...omit(props, 'children', 'marked', 'options', 'element')}
      dangerouslySetInnerHTML={{ __html: props.marked?.(unindent(props.children), props.options) }}
    />
  )
}

export default function Markdown(props: React.HTMLProps<HTMLDivElement> & { className?: string, inline?: boolean, children: string, options?: MarkedOptions, element?: keyof HTMLElementTagNameMap }) {
  return parse ? <MarkdownDiv {...props} marked={props.inline ? parseInline : parse} options={props.options} /> : <>{unindent(props.children)}</>
}
