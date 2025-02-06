import { useMemo } from "react";
import { log } from "../../../lib/util/logger";
import type {
  Filter,
  FilterAddition,
  FilterContext,
  HighlightId,
} from "./types";

class StateHolder implements FilterContext {
  filter: Partial<Record<HighlightId, Filter>> = {};

  public readonly listeners: Set<
    (filter: Partial<Record<HighlightId, Filter>>) => void
  > = new Set();

  public readonly addFilter = (filter: FilterAddition): Filter => {
    const entryId = (filter.id ?? crypto.randomUUID()) as HighlightId;
    const entry = { ...filter, id: entryId };

    const prev = this.filter;

    if (prev[entryId] !== undefined) {
      log.warn(`Cannot add filter with the same id of ${entryId}`);
      return entry;
    }

    this.filter = { ...prev, [entryId]: entry };
    for (const listener of this.listeners) {
      listener(this.filter);
    }

    return entry;
  };

  public readonly remove = (filter: Filter) => {
    const prev = this.filter;
    const { id } = filter;
    const replacement = {} as Partial<Record<HighlightId, Filter>>;
    const entries = Object.entries(prev);
    for (let i = 0; i < entries.length; i += 1) {
      const [key, value] = entries[i];
      if (value && value.id !== id) {
        replacement[key] = value;
      }
    }

    this.filter = replacement;
    for (const listener of this.listeners) {
      listener(this.filter);
    }
  };

  public readonly removeById = (id: string) => {
    const prev = this.filter;
    const replacement = {} as Partial<Record<HighlightId, Filter>>;
    const entries = Object.entries(prev);

    for (let i = 0; i < entries.length; i += 1) {
      const [key, value] = entries[i];
      if (key === id) {
        // b...please.
        // eslint-disable-next-line no-continue
        continue;
      }
      replacement[key] = value;
    }
    this.filter = replacement;
    for (const listener of this.listeners) {
      listener(this.filter);
    }
  };
}

export const useCreateMapFilterContextState = (): FilterContext =>
  useMemo(() => new StateHolder(), []);
