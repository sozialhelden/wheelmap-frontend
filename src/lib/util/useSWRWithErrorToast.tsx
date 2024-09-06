import * as React from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { t } from 'ttag'

type ErrorRenderFunction<ErrorType> = (error: ErrorType) => React.ReactNode;

type ErrorMessageRenderer<ErrorType> = {
  summary: ErrorRenderFunction<ErrorType>;
  instructions: ErrorRenderFunction<ErrorType>;
  details: ErrorRenderFunction<ErrorType>;
}

type ErrorMessageProps<ErrorType> = {
  error: ErrorType;
  errorRenderer: ErrorMessageRenderer<ErrorType>;
}

const defaultErrorRenderer: ErrorMessageRenderer<unknown> = {
  summary: (error) => <span>{(typeof error === 'object' && 'message' in error) ? String(error.message) : t`An error occured.`}</span>,
  instructions: (error) => <span>{t`Please try again later or let us know if the error persists.`}</span>,
  details: (error) => <span>{(typeof error === 'object' && 'stack' in error) ? String(error.stack) : t`An error occured.`}</span>,
}

function ErrorMessage<ErrorType>({
  error, errorRenderer,
}: ErrorMessageProps<ErrorType>) {
  const id = React.useId()
  return (
    <>
      <header>
        <h3>{errorRenderer.summary(error)}</h3>
      </header>
      <section>
        {errorRenderer.instructions(error)}
      </section>
      <summary>
        <label htmlFor={id}>{t`Detailed error message`}</label>
        <details id={id}>
          {errorRenderer.details(error)}
        </details>
      </summary>
    </>
  )
}

/**
 * Like `useSWR`, but displays a toast with the error message if the request fails.
 *
 * You can customize how to render expected `Error` objects by passing an error renderer.
 */
export function useSWRWithCustomErrorToast<Data, ErrorType>(
  errorRenderer: ErrorMessageRenderer<ErrorType>,
  ...args: Parameters<typeof useSWR<Data, ErrorType>>
) {
  const response = useSWR(...args)
  const { data, error } = response
  const toastId = React.useId()
  React.useEffect(() => {
    if (error) {
      const errorElement = <ErrorMessage errorRenderer={errorRenderer} error={error} />
      toast.error(errorElement, {
        toastId,
        delay: 2000,
        autoClose: false,
        position: 'top-right',
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'light',
      })
    } else if (data) {
      toast.dismiss(toastId)
    }
  }, [error, data, toastId, errorRenderer])
  return response
}

/**
 * Like `useSWR`, but displays a toast with the error message if the request fails.
 */
export default function useSWRWithErrorToast<Data, ErrorType>(
  ...args: Parameters<typeof useSWR<Data, ErrorType>>
) {
  return useSWRWithCustomErrorToast<Data, ErrorType>(defaultErrorRenderer, ...args)
}
