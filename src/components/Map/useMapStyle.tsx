import useSWR from "swr";
import { useEnvContext } from "../../lib/context/EnvContext";
import { useDarkMode } from "../shared/useDarkMode";

const fetcher = (input: RequestInfo, init?: RequestInit | undefined) =>
  fetch(input, init).then((res) => res.json());

function useMapStyle() {
  const env = useEnvContext();

  const darkMode = useDarkMode();

  // const styleId = env.NEXT_PUBLIC_MAPBOX_STYLE_ID

  const styleId = darkMode
    ? "cm3t8woq4009b01sgh233ek8f"
    : "ckwdrjpmz4jox16o7libit9p4";

  const accessToken = env.NEXT_PUBLIC_MAPBOX_GL_ACCESS_TOKEN;
  const accountId = env.NEXT_PUBLIC_MAPBOX_ACCOUNT_ID;

  const url = `https://api.mapbox.com/styles/v1/${accountId}/${styleId}?fresh=true&access_token=${accessToken}`;

  const { data, error } = useSWR<mapboxgl.Style, { error: unknown }>(
    url,
    fetcher,
  );

  if (error) return { error };
  if (!data) return { loading: true };

  return { data };
}

export default useMapStyle;
