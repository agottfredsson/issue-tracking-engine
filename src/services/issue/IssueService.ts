import { IUserService } from "../user";
import { IIssueService, Issue, IssueState, IssueType } from "./types";

export default class IssueService implements IIssueService {
  readonly #issues: Issue[];
  readonly #userService: IUserService;

  constructor(userService: IUserService) {
    this.#issues = [];
    this.#userService = userService;
  }

  addIssue(title: String, type: IssueType): String {
    const id = Math.floor(Math.random() * 1000000).toString();
    const created = Date.now().toString();

    this.#issues.push({
      id,
      title,
      created,
      type,
      state: IssueState.ToDo,
      children: [],
    });

    return id;
  }

  removeIssue(issueID: String): void {
    const index = this.findIssueIndex(issueID);
    const issue = this.#issues[index];

    issue.children.map((childID) => {
      const childIndex = this.#issues.findIndex(
        (issue) => issue.id === childID
      );
      const childIssue = this.#issues[childIndex];
      this.#issues[childIndex] = {
        ...childIssue,
        parentId: issue.parentId ?? undefined,
      };
    });
    this.#issues.splice(index, 1);
  }

  getIssue(issueID: String): Issue {
    const index = this.findIssueIndex(issueID);

    return this.#issues[index];
  }

  getIssues(
    state?: IssueState,
    userID?: String,
    issueType?: IssueType,
    startDate?: String,
    endDate?: String
  ): Issue[] {
    let arr = this.#issues;

    if (state) arr = arr.filter((issue) => issue.state === state);
    if (userID) arr = arr.filter((issue) => issue.user?.id === userID);
    if (issueType) arr = arr.filter((issue) => issue.type === issueType);
    if (startDate && endDate)
      arr = arr.filter(
        (issue) => issue.created > startDate && issue.created < endDate
      );

    return arr;
  }

  setIssueState(issueID: String, state: IssueState): void {
    const index = this.findIssueIndex(issueID);
    const issue = this.#issues[index];

    if (state === IssueState.Done) {
      issue.children.map((childID) => {
        const child = this.getIssue(childID);

        if (child.state !== IssueState.Done)
          throw new Error("All related issues needs to be done");
        child.children.map((grandChildID) => {
          const grandChild = this.getIssue(grandChildID);

          if (grandChild.state !== IssueState.Done)
            throw new Error("All related issues needs to be done");
        });
      });
    }
    this.#issues[index] = { ...issue, state };
  }

  setParentIssue(issueID: String, parentIssueID: String): void {
    const index = this.findIssueIndex(issueID);
    const parentIndex = this.findIssueIndex(parentIssueID);

    const childIssue = this.#issues[index];
    const parentIssue = this.#issues[parentIndex];

    this.validateParentIssue(childIssue.type, parentIssue.type);

    this.#issues[index] = {
      ...childIssue,
      parentId: parentIssue.id,
    };

    this.#issues[parentIndex] = {
      ...parentIssue,
      children: [...parentIssue.children, childIssue.id],
    };
  }

  assignUserToIssue(userID: String, issueID: String): void {
    const index = this.findIssueIndex(issueID);
    const user = this.#userService.getUser(userID);

    if (!user) return;

    this.#issues[index] = { ...this.#issues[index], user };
  }

  private validateParentIssue(childType: IssueType, parentType: IssueType) {
    if (childType === IssueType.Epic)
      throw new Error("Epic cannot have a parent issue");

    if (childType === IssueType.Story)
      if (parentType === IssueType.Task)
        throw new Error("Story cannot have Task as parent");
  }

  private findIssueIndex(issueID: String): number {
    const index = this.#issues.findIndex((issue) => issue.id === issueID);

    if (index === -1) throw new Error("Issue not found");

    return index;
  }
}
