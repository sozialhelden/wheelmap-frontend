import * as React from 'react';

export default function usePromise<T>(
  promiseFn: () => PromiseLike<T>,
  deps: any[],
  abort?: () => void
) {
  const [promiseState, setPromiseState] = React.useState<'resolved' | 'rejected' | 'running'>(
    'running'
  );
  const [value, setValue] = React.useState<T>();
  const [error, setError] = React.useState<any>();
  const promise = React.useEffect(() => {
    const promise = promiseFn();
    promise.then(
      value => {
        setValue(value);
        setPromiseState('resolved');
      },
      reason => {
        setError(reason);
        setPromiseState('rejected');
      }
    );
    return abort;
  }, [promiseFn, ...deps]);

  return {
    promiseState,
    value,
    error,
  };
}
