import { IssueService, UserService } from "./services";
import { IssueType } from "./services/issue/types";

const init = () => {
  const userService = new UserService();
  const issueService = new IssueService(userService);
  issueService.addIssue("Eat", IssueType.Epic);
  issueService.addIssue("Sleep", IssueType.Story);
  issueService.addIssue("Code", IssueType.Task);
  issueService.addIssue("Repeat", IssueType.Task);

  userService.addUser("James Cordon");
  userService.addUser("Daniel Craig");
  userService.addUser("Steve Jobs");
};

init();
