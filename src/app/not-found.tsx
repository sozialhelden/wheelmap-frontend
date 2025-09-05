import { Flex } from "@radix-ui/themes";
import ErrorComponent from "~/components/Error";

export default function NotFoundPage() {
  return (
    <Flex height="100vh" width="100vw" align="center" justify="center" p="6">
      <ErrorComponent variant="not-found" />
    </Flex>
  );
}
