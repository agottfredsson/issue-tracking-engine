import { User } from "../../types";
import { IUserService } from "./types";

export default class UserService implements IUserService {
  readonly #users: User[];

  constructor() {
    this.#users = [];
  }

  addUser(name: String): String {
    const id = Math.floor(Math.random() * 1000000).toString();
    const created = Date.now().toString();

    this.#users.push({
      id,
      name,
      created,
    });

    return id;
  }

  getUser(userID: String): User {
    const user = this.#users.find((user) => user.id === userID);

    if (!user) throw new Error("User not found");

    return user;
  }

  getUsers(): User[] {
    return this.#users;
  }

  removeUser(userID: String): void {
    const index = this.#users.findIndex((issue) => issue.id === userID);
    if (index === -1) throw new Error("User not found");

    this.#users.splice(index, 1);
  }
}
