import useSWR, { responseInterface } from 'swr'
import { fetcherFn, ConfigInterface, keyInterface } from 'swr/dist/types'
import { createContext, useContext } from 'react'

type FetchJob<Data = any, Error = any> = {
  key: keyInterface;
  fn?: fetcherFn<Data>;
  config?: ConfigInterface<Data, Error>;
};

// TODO: This is preliminary code to collect fetch jobs executed as a side effect from useSWR.
// At a later stage, all fetch requests are supposed to be collected like in styled-components SSR,
// so we can use getInitialProps to hand over the preloaded data to the client.
// See also _document.tsx.

const prefetchContext = createContext<FetchJob<any>[]>([])

export default function useSWRWithPrefetch<Data = any, Error = any>(
  key: keyInterface,
  fn?: fetcherFn<Data>,
  config?: ConfigInterface<Data, Error>,
): responseInterface<Data, Error> {
  const ctx = useContext(prefetchContext)
  ctx.push({ key, fn, config })
  const result = useSWR(key, fn, config)
  return result
}
