import storage from "local-storage-fallback";

export { storage };

const lastMoveDateString = storage.getItem("wheelmap.map.lastMoveDate");

const initialPropsCategoryDataString = storage.getItem(
  "wheelmap.initialProps.rawCategoryLists",
);
const initialPropsAppString = storage.getItem("wheelmap.initialProps.app");

const hasInitialProps = !!(
  initialPropsCategoryDataString && initialPropsAppString
);

const savedState = {
  map: {
    lastCenter: ["lat", "lon"].map((coordinate) =>
      storage.getItem(`wheelmap.map.lastCenter.${coordinate}`),
    ),
    lastMoveDateString,
    lastMoveDate: lastMoveDateString && new Date(lastMoveDateString),
    lastZoom: storage.getItem("wheelmap.map.lastZoom"),
    shouldLocateUser:
      storage.getItem("wheelmap.map.shouldLocateUser") === "true",
  },
  initialProps: hasInitialProps
    ? {
        rawCategoryLists: JSON.parse(initialPropsCategoryDataString),
        app: JSON.parse(initialPropsAppString),
      }
    : null,
};

export default savedState;

export function saveState(state: { [key: string]: string }) {
  for (const key of Object.keys(state)) {
    storage.setItem(`wheelmap.${key}`, state[key]);
  }
}

export function hasOpenedLocationHelp() {
  return storage.getItem("wheelmap.hasOpenedLocationHelp") === "true";
}
