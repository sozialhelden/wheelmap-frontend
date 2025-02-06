export type ChangesetState =
  | "none"
  | "creatingChangeset"
  | "creatingChange"
  | "changesetComplete"
  | "inhouseDBSynced"
  | { error: Error; lastState: ChangesetState };
