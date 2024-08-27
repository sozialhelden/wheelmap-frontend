import * as React from 'react';

export type ContextAndValue<T> = [React.Context<T>, T];

/**
 * This function allows you to render a React component with multiple nested React contexts around
 * it, but makes the code doing that more readable.
 *
 * @param contextAndValuePairs an array of [context ref, context value] entries.
 * @param children the react children to render.
 * @example
 * ```jsx
 * const contexts: ContextAndValue<any>[] = [
 *    [SomeContext, someValue],
 *    [UndoContext, undoContext]
 * ];
 * return <div>
 *   {composeContexts(contexts, navbarAndBody)}
 * </div>;
 * ```
 */

const composeContexts = (
  contextAndValuePairs: ContextAndValue<any>[],
  children: React.ReactNode,
) => contextAndValuePairs.reduce(
  (acc: React.ReactNode, [Context, value]: ContextAndValue<any>) => <Context.Provider value={value}>{acc}</Context.Provider>,
  children,
);

export default composeContexts;
