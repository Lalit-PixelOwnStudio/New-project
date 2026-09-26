/**
 * A failure the caller should show or turn into an HTTP status (a wrong
 * signature, a daily limit), as opposed to a bug. `code` is stable for the
 * browser to act on; `message` is for people.
 */
export class ServiceError extends Error {
  constructor(
    message: string,
    readonly status = 400,
    readonly code = "bad_request",
  ) {
    super(message);
  }
}
