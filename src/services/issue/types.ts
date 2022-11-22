import { User } from "../../types";

export enum IssueType {
  Epic = "EPIC",
  Story = "STORY",
  Task = "TASK",
}

export enum IssueState {
  ToDo = "TODO",
  InProgress = "IN_PROGRESS",
  Done = "DONE",
}

export interface Issue {
  id: String;
  title: String;
  created: String;
  type: IssueType;
  state: IssueState;
  parentId?: String;
  children: String[];
  user?: User;
}

export interface IIssueService {
  addIssue(title: String, type: IssueType): String;
  removeIssue(issueID: String): void;
  getIssue(issueID: String): Issue;
  getIssues(
    state?: IssueState,
    userID?: String,
    issueType?: IssueType,
    startDate?: String,
    endDate?: String
  ): Issue[];
  setIssueState(issueID: String, state: IssueState): void;
  setParentIssue(issueID: String, parentIssueID: String): void;
  assignUserToIssue(userID: String, issueID: String): void;
}
