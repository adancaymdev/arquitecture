import { Exception } from "./Exception";

export class InternalException extends Exception {
  constructor(message: string) {
    super({ message, code: 500 });
  }
}
