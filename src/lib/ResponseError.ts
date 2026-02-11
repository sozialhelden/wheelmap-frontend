export default class ResponseError extends Error {
  response: Response;

  constructor(message: string, response: Response) {
    super(message);
    this.response = response;
  }

  get status(): number {
    return this.response.status;
  }

  get statusCode(): number {
    return this.response.status;
  }
}
