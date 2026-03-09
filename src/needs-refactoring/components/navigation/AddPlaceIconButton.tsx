import { IconButton, Theme } from "@radix-ui/themes";
import { t } from "@transifex/native";
import { MapPinPlus } from "lucide-react";
import Link from "next/link";
import { AppStateAwareLink } from "~/modules/app-state/components/AppStateAwareLink";
import type { IAutoLinkProps } from "./AppLink";

export default function AddPlaceIconButton({ url, label }: IAutoLinkProps) {
  if (!url) {
    return null;
  }

  const isExternal = url.startsWith("http");
  const LinkElement = isExternal ? Link : AppStateAwareLink;
  const ariaLabel = label || t("Add new location");

  return (
    <Theme radius="small">
      <IconButton variant="soft" size="3" asChild>
        <LinkElement
          href={url}
          target={isExternal ? "_blank" : undefined}
          rel={isExternal ? "noreferrer noopener" : undefined}
          aria-label={ariaLabel}
        >
          <MapPinPlus aria-hidden="true" />
        </LinkElement>
      </IconButton>
    </Theme>
  );
}
