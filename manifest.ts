import { Manifest } from "deno-slack-sdk/mod.ts";
import { PostIssueMessage } from "./functions/post_issue_message.ts";
import SubmitIssueWorkflow from "./workflows/submit_issue.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "deno-issue-submission",
  description: "A basic sample that demonstrates issue submission to channel",
  icon: "assets/default_new_app_icon.png",
  workflows: [SubmitIssueWorkflow],
  functions: [PostIssueMessage],
  outgoingDomains: [],
  botScopes: ["commands", "chat:write", "chat:write.public"],
});
