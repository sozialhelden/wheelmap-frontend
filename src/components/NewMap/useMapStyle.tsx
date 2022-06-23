import useSWR from "swr";

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json());

function useMapStyle() {
  const styleId = process.env.REACT_APP_MAPBOX_STYLE_ID;
  const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
  const accountId = process.env.REACT_APP_MAPBOX_ACCOUNT_ID;

  const url = `https://api.mapbox.com/styles/v1/${accountId}/${styleId}?fresh=true&access_token=${accessToken}`;

  const { data, error } = useSWR<mapboxgl.Style, { error: any }>(url, fetcher);

  if (error) return { error };
  if (!data) return { loading: true };

  return { data };
}

export default useMapStyle;
