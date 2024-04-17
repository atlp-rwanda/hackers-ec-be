export class HttpException {
  public status: string;
  public message: string;

  constructor(status: string, message: string) {
    this.status = status;
    this.message = message;
  }
  response(): { status: string; message: string } {
    return {
      status: this.status,
      message: this.message,
    };
  }
}
