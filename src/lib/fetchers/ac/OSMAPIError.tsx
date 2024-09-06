export default class OSMAPIError extends Error {
  constructor(public reason: string, public details: string, public status: number, public statusText: string) {
    super(reason)
  }
}
