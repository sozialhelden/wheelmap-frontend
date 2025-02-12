import { Button } from "@radix-ui/themes";
import Link from "next/link";
import styled from "styled-components";
import { t } from "ttag";
import type { IBranding } from "~/lib/model/ac/IBranding";
import VectorImage from "../shared/VectorImage";

const StyledButton = styled(Button)`
    max-width: min(100%, 150px);
`;

export default function Logo({
  branding,
  productName,
}: { branding?: IBranding; productName: string }) {
  return (
    <StyledButton aria-label={t`Home`} variant="ghost" radius="none" asChild>
      <Link href="/onboarding">
        <VectorImage
          svg={branding?.vectorLogoSVG}
          maxWidth="100%"
          hasShadow={false}
          svgHTMLAttributes={{ "aria-label": t`${productName} logo` }}
        />
      </Link>
    </StyledButton>
  );
}
