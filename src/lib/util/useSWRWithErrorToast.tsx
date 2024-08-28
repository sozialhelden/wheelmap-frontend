import { useEffect, useMemo } from 'react'
import { toast } from 'react-toastify'
import useSWR from 'swr'
import { t } from 'ttag'

type ErrorTransformerProps<ErrorType> = {
  summary: (error: ErrorType) => React.ReactNode;
  instructions: (error: ErrorType) => React.ReactNode;
  details: (error: ErrorType) => React.ReactNode;
};

function ErrorMessage<ErrorType>({
  summary, instructions, details, error,
}: ErrorTransformerProps<ErrorType> & { error: ErrorType }) {
  return (
    <>
      <header>
        <h3>{summary(error)}</h3>
      </header>
      <section>
        {instructions(error)}
      </section>
      <summary>
        <label htmlFor="det">{t`Detailed error message`}</label>
        <details id="det">
          {details(error)}
        </details>
      </summary>
    </>
  )
}

export default function useSWRWithErrorToast<Data, ErrorType>(
  transform: ErrorTransformerProps<ErrorType>,
  ...args: Parameters<typeof useSWR<Data, ErrorType>>
) {
  const response = useSWR(...args);
  const { data, error } = response;
  const toastId = useMemo(() => String(Math.random()), [])
  useEffect(() => {
    if (error) {
      const errorElement = <ErrorMessage {...transform} error={error} />
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
  }, [error, data, toastId, transform])
  return response;
}
