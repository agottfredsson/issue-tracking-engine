import { IssueService, UserService } from "../../../src/services";
import { IssueState, IssueType } from "../../../src/services/issue/types";

describe("services.IssueService", () => {
  let userService = new UserService();
  let issueService = new IssueService(userService);

  afterEach(() => {
    userService = new UserService();
    issueService = new IssueService(userService);
  });

  describe("removeIssue", () => {
    it("should remove issue", () => {
      issueService.addIssue("Test", IssueType.Epic);
      issueService.removeIssue(issueService.getIssues()[0].id);
      expect(issueService.getIssues().length).toBe(0);
    });
    it("should add parentId from removed issue to child", () => {
      issueService.addIssue("parent", IssueType.Story);
      issueService.addIssue("child", IssueType.Story);
      issueService.addIssue("grandchild", IssueType.Story);
      const issues = issueService.getIssues();
      issueService.setParentIssue(issues[1].id, issues[0].id);
      issueService.setParentIssue(issues[2].id, issues[1].id);

      issueService.removeIssue(issues[1].id);

      expect(issues[1].parentId).toBe(issues[0].id);
    });
  });
  describe("getIssue", () => {
    it("should get issue", () => {
      issueService.addIssue("Test", IssueType.Epic);
      const issue = issueService.getIssue(issueService.getIssues()[0].id);

      expect(issue.title).toBe("Test");
    });
  });
  describe("getIssues", () => {
    it("should get issues with filtering", () => {
      issueService.addIssue("1", IssueType.Story);
      issueService.addIssue("2", IssueType.Task);
      issueService.addIssue("3", IssueType.Epic);
      issueService.addIssue("4", IssueType.Story);
      issueService.addIssue("5", IssueType.Task);
      issueService.setIssueState(
        issueService.getIssues()[0].id,
        IssueState.Done
      );
      userService.addUser("James");
      issueService.assignUserToIssue(
        userService.getUsers()[0].id,
        issueService.getIssues()[0].id
      );

      const issues = issueService.getIssues(
        IssueState.Done,
        userService.getUsers()[0].id,
        IssueType.Story,
        "1",
        "9999999999999"
      );
      expect(issues.length).toBe(1);
    });
  });
  describe("setIssueState", () => {
    it("should update issue state", () => {
      issueService.addIssue("Test", IssueType.Story);
      issueService.setIssueState(
        issueService.getIssues()[0].id,
        IssueState.Done
      );
      expect(issueService.getIssues()[0].state).toBe(IssueState.Done);
    });
    it("should throw error if children not done", () => {
      issueService.addIssue("parent", IssueType.Story);
      issueService.addIssue("child", IssueType.Story);
      issueService.addIssue("grandchild", IssueType.Story);
      const issues = issueService.getIssues();
      issueService.setParentIssue(issues[1].id, issues[0].id);
      issueService.setParentIssue(issues[2].id, issues[1].id);
      issueService.setIssueState(issues[2].id, IssueState.Done);
      issueService.setIssueState(issues[1].id, IssueState.Done);
      issueService.setIssueState(issues[2].id, IssueState.InProgress);
      expect(() =>
        issueService.setIssueState(issues[0].id, IssueState.Done)
      ).toThrow("All related issues needs to be done");
    });
  });
  describe("setParentIssue", () => {
    it("should set parent issue", () => {
      issueService.addIssue("child", IssueType.Task);
      issueService.addIssue("parent", IssueType.Epic);
      issueService.setParentIssue(
        issueService.getIssues()[0].id,
        issueService.getIssues()[1].id
      );
      const parent = issueService.getIssue(
        issueService.getIssues()[0].parentId!
      );
      expect(parent.title).toBe("parent");
    });
    it("should throw error if no issue found", () => {
      issueService.addIssue("child", IssueType.Story);
      expect(() =>
        issueService.setParentIssue("123", issueService.getIssues()[0].id)
      ).toThrow("Issue not found");
    });
    it("should throw if child is epic", () => {
      issueService.addIssue("child", IssueType.Epic);
      issueService.addIssue("parent", IssueType.Story);

      expect(() =>
        issueService.setParentIssue(
          issueService.getIssues()[0].id,
          issueService.getIssues()[1].id
        )
      ).toThrow("Epic cannot have a parent issue");
    });
    it("should throw if child is story and parent is task", () => {
      issueService.addIssue("child", IssueType.Story);
      issueService.addIssue("parent", IssueType.Task);

      expect(() =>
        issueService.setParentIssue(
          issueService.getIssues()[0].id,
          issueService.getIssues()[1].id
        )
      ).toThrow("Story cannot have Task as parent");
    });
  });
  describe("assignUserToIssue", () => {
    it("should assign user to issue", () => {
      userService.addUser("James");
      issueService.addIssue("Test", IssueType.Task);
      issueService.assignUserToIssue(
        userService.getUsers()[0].id,
        issueService.getIssues()[0].id
      );
      expect(issueService.getIssues()[0].user?.name).toBe("James");
    });
  });
});
