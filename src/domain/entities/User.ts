export class User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(id: string, name: string) {
    this.id = id;
    this.name = name;
  }
}
