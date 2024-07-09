export default async function fetchJSON(url: RequestInfo | URL) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Network response was not OK (${response.status}).`);
  }
  const json = await response.json();
  return json;
}
