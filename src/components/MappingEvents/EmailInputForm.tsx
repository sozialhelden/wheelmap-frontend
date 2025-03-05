import { t } from "@transifex/native";
import React from "react";
import { PrimaryButton } from "../shared/Button";

export const EmailRegEx = /(.+)@(.+){2,}\.(.+){2,}/;

export function EmailInputForm(props: {
  collectionMode: "disabled" | "required" | "optional";
  initialEmailAddress: string | null;
  invitationToken: string | null;
  onSubmit: (emailAddress?: string) => void;
}) {
  const { onSubmit, collectionMode, initialEmailAddress, invitationToken } =
    props;

  const inputField = React.useRef<HTMLInputElement>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [isBusy, setBusy] = React.useState<boolean>(false);
  const showInput = collectionMode !== "disabled" && !invitationToken;

  const submitHandler = (e) => {
    e.stopPropagation();
    e.preventDefault();

    const inputValue = inputField.current?.value.trim();
    if (!collectionMode || invitationToken || collectionMode === "disabled") {
      setBusy(true);
      onSubmit();
    } else if (collectionMode === "optional" && !inputValue) {
      setBusy(true);
      onSubmit();
    } else if (!inputValue) {
      setError(t("Your email address is required!"));
    } else {
      const isValid = EmailRegEx.test(inputValue);
      if (isValid) {
        setBusy(true);
        onSubmit(inputValue);
      } else {
        setError(t("This email address is not valid."));
      }
    }
  };

  const labelSuffix = {
    // translator: Shown next to a form input label for a field where the user must enter a value
    required: t("(required)"),
    // translator: Shown next to a form input label for a field where the user can optionally enter a value
    optional: t("(optional)"),
  }[collectionMode];

  return (
    <form className={error ? "has-error" : ""} onSubmit={submitHandler}>
      {showInput && (
        <div className={error ? "form-control is-invalid" : "form-control"}>
          <label>
            <strong>{t("Email address")}</strong>
            {labelSuffix && (
              <>
                &nbsp;
                {labelSuffix}
              </>
            )}

            <input
              className={error ? "is-invalid" : ""}
              required={collectionMode === "required"}
              type="email"
              autoComplete="true"
              defaultValue={
                typeof initialEmailAddress === "string"
                  ? initialEmailAddress
                  : ""
              }
              ref={inputField}
              onFocus={(event) => {
                window.scrollTo(0, 0); // Fix iOS mobile safari viewport out of screen bug
              }}
              disabled={isBusy}
              name="email"
            />
          </label>
          {error && <p className="form-text text-danger">{error}</p>}
        </div>
      )}
      <PrimaryButton disabled={isBusy} onClick={submitHandler}>
        {t("Let’s go")}
      </PrimaryButton>
      {invitationToken && (
        <footer>
          {t("You are participating as {initialEmailAddress}.", {
            initialEmailAddress,
          })}
        </footer>
      )}
    </form>
  );
}
