import { Trigger } from "deno-slack-api/types.ts";
import SubmitIssueWorkflow from "../workflows/submit_issue.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/future/triggers
 */
const submitIssue: Trigger<typeof SubmitIssueWorkflow.definition> = {
  type: "shortcut",
  name: "Submit an issue",
  description: "Submit an issue to channel",
  workflow: "#/workflows/submit_issue",
  inputs: {
    interactivity: {
      value: "{{data.interactivity}}",
    },
    channel: {
      value: "{{data.channel_id}}",
    },
  },
};

export default submitIssue;
