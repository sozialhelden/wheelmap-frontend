export default class ResourceError extends Error {
  constructor(
    /**
     * The reason behind the error. The text should be understandable for an end-user, and should
     * even include a remedy.
     */
    public reason: string,
    /**
     * Additional details about the error. This can be a stack trace, a JSON object, or any other
     * information that might help debugging the issue.
     */
    public details: string,
    /**
     * The HTTP status code of the response that caused the error.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    public status: number,
    /**
     * The HTTP status text of the response that caused the error.
     * @see https://developer.mozilla.org/en-US/docs/Web/HTTP/Status
     */
    public statusText: string,
  ) {
    super(reason);
  }
}
