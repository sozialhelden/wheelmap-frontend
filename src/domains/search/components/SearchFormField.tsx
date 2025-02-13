import { Cross1Icon, MagnifyingGlassIcon } from "@radix-ui/react-icons";
import { Flex, IconButton, Theme } from "@radix-ui/themes";
import {
  type ChangeEventHandler,
  type KeyboardEventHandler,
  useEffect,
  useState,
} from "react";
import styled from "styled-components";
import { t } from "ttag";

const StyledSearchFormField = styled.div<{ $isDropdownOpen: boolean }>`
  background: var(--color-panel-solid);
  border: 1px solid var(--gray-7);
  box-shadow: rgba(0,0,0,0.2) 0 .025rem .2rem;
  border-radius: var(--radius-4);
  border-bottom-right-radius: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "0" : "var(--radius-4)")};
  border-bottom-left-radius: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "0" : "var(--radius-4)")};
  display: flex;
  justify-content: space-between;
  align-items: center;
  outline-offset: .05rem;
  overflow: hidden;
  transition: all 300ms ease;
  outline: 2px solid transparent;
  &:hover {
    border-color: var(--gray-8);
  }
  &:focus-within {
    outline: ${({ $isDropdownOpen }) => ($isDropdownOpen ? "2px solid transparent" : "2px solid var(--accent-8)")};
  }
`;
const SearchInput = styled.input`
  border: 0;
  outline: 0;
  padding: .7rem .8rem;
  flex-basis: 100%;
  background: transparent;
  &::-webkit-search-decoration,
  &::-webkit-search-cancel-button,
  &::-webkit-search-results-button,
  &::-webkit-search-results-decoration {
    -webkit-appearance:none;
  }
`;
const IconOverlay = styled.div`
  position: absolute;
  pointer-events: none;
  top: 0;
  right: 0;
  bottom: 0;
  width: 32px;
  display: flex;
  align-items: center;
`;

export function SearchFormField({
  isDropdownOpen,
  value,
  onChange,
  onReset,
  onHighlightNext,
  onHighlightPrevious,
  onOpenHighlighted,
  ...props
}: {
  isDropdownOpen: boolean;
  value: string;
  onHighlightNext?: () => void;
  onHighlightPrevious?: () => void;
  onOpenHighlighted?: () => void;
  onChange?: (value: string) => void;
  onReset?: () => void;
}) {
  const [input, setInput] = useState<string>(value);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout>();

  const reset = () => {
    setInput("");
    onChange?.("");
    onReset?.();
  };

  const handleInputChange: ChangeEventHandler<HTMLInputElement> = (event) => {
    setInput(event.target.value);
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
    setDebounceTimeout(setTimeout(() => onChange?.(event.target.value), 250));
  };

  const handleKeyDown: KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key === "ArrowDown") {
      onHighlightNext?.();
      event.preventDefault();
      return;
    }
    if (event.key === "ArrowUp") {
      onHighlightPrevious?.();
      event.preventDefault();
      return;
    }
    if (event.key === "Enter") {
      onOpenHighlighted?.();
      event.preventDefault();
      return;
    }
    if (event.key === "Escape") {
      reset();
    }
  };

  useEffect(() => {
    setInput(value);
  }, [value]);

  return (
    <Theme radius="medium" asChild>
      <StyledSearchFormField $isDropdownOpen={isDropdownOpen}>
        <SearchInput
          value={input}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          type="search"
          placeholder={t`Search for place or address`}
          {...props}
        />
        {input ? (
          <Flex width="32px">
            <IconButton
              variant="ghost"
              size="3"
              color="gray"
              onClick={reset}
              aria-label={t`Clear search`}
            >
              <Cross1Icon height="16" width="16" aria-hidden />
            </IconButton>
          </Flex>
        ) : (
          <IconOverlay>
            <MagnifyingGlassIcon height="16" width="16" />
          </IconOverlay>
        )}
      </StyledSearchFormField>
    </Theme>
  );
}
