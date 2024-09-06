export default class ResourceError extends Error {
  constructor(public reason: string, public details: string, public status: number, public statusText: string) {
    super(reason)
  }
}
