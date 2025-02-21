import { Button } from "@radix-ui/themes";
import type { Responsive } from "@radix-ui/themes/dist/cjs/props";
import type React from "react";

type Props = {
  text: string;
  onClick: () => void;
  size?: Responsive<"3" | "1" | "2" | "4">;
  disabled?: boolean;
  loading?: boolean;
};

export const PrimaryButton = ({
  text,
  onClick,
  size = "3",
  disabled = false,
  loading = false,
}: Props) => {
  return (
    <Button
      variant="solid"
      size={size}
      onClick={onClick}
      disabled={disabled}
      loading={loading}
    >
      {text}
    </Button>
  );
};

export const SecondaryButton = ({ text, onClick, size = "3" }: Props) => {
  return (
    <Button
      color="gray"
      variant="soft"
      size={size}
      highContrast
      onClick={onClick}
    >
      {text}
    </Button>
  );
};

export const TertiaryButton = ({ text, onClick, size = "3" }: Props) => {
  return (
    <Button
      color="gray"
      variant="surface"
      size={size}
      highContrast
      onClick={onClick}
    >
      {text}
    </Button>
  );
};
