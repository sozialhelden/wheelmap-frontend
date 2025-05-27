import { pathsToConsumedTagKeys } from "~/needs-refactoring/lib/model/osm/tag-config/pathsToConsumedTagKeys";
import { get, set } from "lodash";

export interface ITreeNode {
  [key: string]: string | ITreeNode; // type for unknown keys.
}

/**
 * @returns a data structure like this:
 *
 * ```javascript
 * {
 *   wheelchair: "wheelchair"
 *   payment: {
 *   mastercard: { nfc: "payment:mastercard:nfc", chip: "payment:mastercard:chip" }
 *   visa: "payment:visa"
 * }
 * ```
 */

export function generateTree(keys: string[]): ITreeNode {
  const result: ITreeNode = {};

  for (const key of keys) {
    for (const [bucketName, keyRegExp] of pathsToConsumedTagKeys) {
      const matches = key.match(keyRegExp);
      if (matches) {
        const path = key.replace(keyRegExp, bucketName);
        const parentPath = path.replace(/\.[^.]+$/, "");
        const existingParent = get(result, parentPath);
        const newObject =
          typeof existingParent === "string" ? existingParent : key;
        set(result, path, newObject);
        // log.log(`${key} matched ${keyRegExp} -> ${bucketName}, existing:`, existingParent, `new:`, newObject);
        // log.log(`Assigned`, path, '=', newObject);
        // log.log(`Result`, result);
        break;
      }
    }
  }
  return result;
}
