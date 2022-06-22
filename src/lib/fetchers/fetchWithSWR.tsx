import useSWR from "swr";

export function getData(key, fetcher) {
  const { data, error } = useSWR(key, fetcher);
  if (error) {
    throw new Error(error);
  } else {
    return data;
  }
}
