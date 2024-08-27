/**
 * Removes first level of whitespace indentation from a given string by recognizing the indentation
 * level from the first line that has non-whitespace content contains  to remove.
 *
 * This allows to specify hardcoded strings with indentation in code without having to break the
 * code's own indentation:
 *
 * @example
 *   // before:
 *   function getMarkdown() {
 *     return `
 *   # Hello
 *
 *   - this is a markdown list
 *   - with multiple items
 *   `;
 *   }
 *
 *   // with unindent:
 *   function getMarkdown() {
 *     return unindent(`
 *       # Hello
 *
 *       - this is a markdown list
 *       - with multiple items
 *     `);
 *   }
*/
export default function unindent(input: string): string {
  const firstLineWithContent = input
    .split(/\n/)
    .find((line) => line.replace(/\s/, '').length > 0)
  if (!firstLineWithContent) {
    return input
  }

  const matchedIndentation = firstLineWithContent.match(/^\s+/)
  if (!matchedIndentation) {
    return input
  }

  const matchedIndentationString = matchedIndentation[0]
  if (!matchedIndentationString) {
    return input
  }

  const indentationRegExp = new RegExp(`^${matchedIndentationString}`)
  return input
    .split(/\n/)
    .map((line) => line.replace(indentationRegExp, ''))
    .join('\n')
}
