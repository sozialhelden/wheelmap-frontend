import { describe, expect, test } from "vitest";
import {
  buildScaledImageUrl,
  getImageLoadRetryDelay,
} from "~/components/image/accessibilityCloudImageUrl";
import type { AccessibilityCloudImage } from "~/needs-refactoring/lib/model/ac/Feature";

const image: AccessibilityCloudImage = {
  _id: "g7Hbt8opdbcg9bhwr",
  isoDate: "2023-10-24T06:57:27.716Z",
  url: "https://example.com/surveyResult/abc/def.jpeg",
  imagePath: "surveyResult/abc/def.jpeg",
  mimeType: "image/jpeg",
  dimensions: { width: 4032, height: 3024 },
};

const baseUrl = "https://v2.accessibility.cloud";

describe("buildScaledImageUrl", () => {
  test("it keeps the URL format of the first attempt stable", () => {
    expect(buildScaledImageUrl({ baseUrl, image, requestedWidth: 96 })).toBe(
      "https://v2.accessibility.cloud/images/scale/surveyResult/abc/def.jpeg?fit=inside&fitw=96&fith=72&",
    );
  });

  test("it adds the retry number to the URL on retries", () => {
    expect(
      buildScaledImageUrl({ baseUrl, image, requestedWidth: 96, retry: 2 }),
    ).toBe(
      "https://v2.accessibility.cloud/images/scale/surveyResult/abc/def.jpeg?fit=inside&fitw=96&fith=72&retry=2",
    );
  });

  test("it adds the angle and version", () => {
    expect(
      buildScaledImageUrl({
        baseUrl,
        image: { ...image, angle: -90 },
        requestedWidth: 96,
        version: "123",
        retry: 1,
      }),
    ).toBe(
      "https://v2.accessibility.cloud/images/scale/surveyResult/abc/def.jpeg?fit=inside&fitw=96&fith=72&angle=270&version=123&retry=1",
    );
  });

  test("it never requests images larger than the original or the server maximum", () => {
    expect(
      buildScaledImageUrl({ baseUrl, image, requestedWidth: 3840 }),
    ).toContain("fitw=1920&fith=1440");
  });
});

describe("getImageLoadRetryDelay", () => {
  test("it backs off exponentially", () => {
    expect([0, 1, 2].map(getImageLoadRetryDelay)).toEqual([1000, 2000, 4000]);
  });
});
