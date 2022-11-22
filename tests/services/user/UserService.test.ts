import { UserService } from "../../../src/services";

describe("services.UserService", () => {
  let userService = new UserService();

  afterEach(() => {
    userService = new UserService();
  });

  describe("addUser", () => {
    it("should add User", () => {
      userService.addUser("James");
      const here = userService.getUsers();
      expect(here[0].name).toBe("James");
    });
  });
  describe("getUser", () => {
    it("should get User", () => {
      const ID = userService.addUser("Tomas");
      expect(userService.getUser(ID)).not.toBeNull();
    });
    it("should return null if no user found", () => {
      expect(() => userService.getUser("Tomas")).toThrow("User not found");
    });
  });
  describe("getUsers", () => {
    it("should get return users", () => {
      userService.addUser("James");
      userService.addUser("Steven");
      userService.addUser("Bob");
      expect(userService.getUsers().length).toBe(3);
    });
  });
  describe("removeUser", () => {
    it("should remove user", () => {
      userService.addUser("James");
      const users = userService.getUsers();
      userService.removeUser(users[0].id);
      expect(userService.getUsers().length).toBe(0);
    });
    it("should throw error if user not found", () => {
      expect(() => userService.removeUser("123")).toThrow("User not found");
    });
  });
});
