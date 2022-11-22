import { User } from "../../types";

export interface IUserService {
  addUser(name: String): String;
  getUser(userID: String): User;
  getUsers(): User[];
  removeUser(userID: String): void;
}
