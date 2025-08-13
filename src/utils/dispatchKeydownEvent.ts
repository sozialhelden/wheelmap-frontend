export const dispatchKeydownEvent = (ref: React.RefObject<HTMLElement>) => {
  if (ref.current) {
    const keyEvent = new KeyboardEvent("keydown", {
      key: "Enter",
      bubbles: true,
      cancelable: true,
    });
    ref.current.dispatchEvent(keyEvent);
  }
};
