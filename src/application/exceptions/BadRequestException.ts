import { Exception } from "./Exception";

export class BadRequestException extends Exception {
  constructor(message: string) {
    super({ message, code: 400 });
  }
}
