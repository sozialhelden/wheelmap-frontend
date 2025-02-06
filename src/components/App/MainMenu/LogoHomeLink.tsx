import { Button } from "@radix-ui/themes";
import Link from "next/link";
import { useMemo } from "react";
import { t } from "ttag";
import type { IBranding } from "../../../lib/model/ac/IBranding";
import VectorImage from "../../shared/VectorImage";

export default function LogoHomeLink({
  branding,
  productName,
}: { branding: IBranding | undefined; productName: string }) {
  return (
    <Button aria-label={t`Home`} variant="ghost" radius="none" asChild>
      <Link href="/onboarding">
        <VectorImage
          svg={branding?.vectorLogoSVG}
          maxHeight="30px"
          maxWidth="150px"
          hasShadow={false}
          svgHTMLAttributes={{ "aria-label": t`${productName} logo` }}
        />
      </Link>
    </Button>
  );
}
