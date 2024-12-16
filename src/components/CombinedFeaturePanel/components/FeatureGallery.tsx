import { CameraIcon } from "@radix-ui/react-icons";
import {
  AspectRatio,
  Box,
  Button,
  Callout,
  Card,
  Dialog,
  Flex,
  Grid,
  Inset,
  VisuallyHidden,
} from "@radix-ui/themes";
import { useRouter } from "next/router";
import {
  type FC,
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
/* eslint-disable jsx-a11y/alt-text */
/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
/* eslint-disable @next/next/no-img-element */
import useSWR from "swr";
import useAccessibilityCloudAPI from "~/lib/fetchers/ac/useAccessibilityCloudAPI";
import type { AccessibilityCloudImage } from "~/lib/model/ac/Feature";
import type { AnyFeature } from "~/lib/model/geo/AnyFeature";
import { Gallery } from "./Gallery/Gallery";
import { GalleryAddImageButton } from "./Gallery/GalleryAddImageButton";
import { makeImageIds, makeImageLocation } from "./Gallery/util";

const fetcher = (urls: string[]) => {
  const f = (u) =>
    fetch(u).then((r) => {
      if (r.ok) {
        return r.json() as Promise<ImageResponse>;
      }

      throw new Error("Request failed");
    });
  return Promise.all(urls.flatMap(f));
};

interface ImageResponse {
  totalCount: number;
  images: AccessibilityCloudImage[];
}

export const FeatureGallery: FC<{
  feature: AnyFeature;
  focusImage?: string;
}> = ({ feature, focusImage }) => {
  const ids = makeImageIds(feature);
  const { baseUrl, appToken } = useAccessibilityCloudAPI({ cached: true });
  const { data } = useSWR(
    baseUrl && appToken
      ? ids.map((x) => makeImageLocation(baseUrl, appToken, x.context, x.id))
      : null,
    fetcher,
  );
  const images = useMemo(() => data?.flatMap((x) => x.images) ?? [], [data]);

  return (
    <>
      <Gallery images={images} activeImageId={focusImage} />
      <GalleryAddImageButton />
    </>
  );
};
