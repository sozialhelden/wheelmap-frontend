import { LinkBreak1Icon } from "@radix-ui/react-icons";
import { Box, Button, Callout, Code, Heading, Text } from "@radix-ui/themes";
import Link from "next/link";
import { ErrorBoundary as ReactErrorBoundary } from "react-error-boundary";
import { t } from "ttag";

function FallbackComponent({
  error,
  resetErrorBoundary,
}: { error: Error; resetErrorBoundary: () => void }) {
  // translator: Shown as apology text / description on the error page.
  const apologyText = t`Sorry, there was an error – that should not have happened!`;

  // translator: Shown on the error page.
  const returnHomeButtonCaption = t`Return home`;

  return (
    <Callout.Root color="red" highContrast>
      <Callout.Icon>
        <LinkBreak1Icon />
      </Callout.Icon>
      <Callout.Text>
        <Text as="p">{apologyText}</Text>
        <Text as="p">
          <Code>{error?.message && ` — ${error.message}`}</Code>
        </Text>
        <Box>
          <Link href="/" className="button-cta-close">
            <Button variant="outline" onClick={resetErrorBoundary}>
              {returnHomeButtonCaption}
            </Button>
          </Link>
        </Box>
      </Callout.Text>
    </Callout.Root>
  );
}

export default function ErrorBoundary({
  children,
}: { children: React.ReactNode }) {
  return (
    <ReactErrorBoundary FallbackComponent={FallbackComponent}>
      {children}
    </ReactErrorBoundary>
  );
}

export const withErrorBoundary = (WrappedComponent: React.FC) => {
  const Wrapper = ({ ...props }) => (
    <ErrorBoundary>
      <WrappedComponent {...props} />
    </ErrorBoundary>
  );
  return Wrapper;
};
