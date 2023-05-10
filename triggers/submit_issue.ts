import { Trigger } from "deno-slack-sdk/types.ts";
import { TriggerContextData, TriggerTypes } from "deno-slack-api/mod.ts";
import SubmitIssueWorkflow from "../workflows/submit_issue.ts";

/**
 * Triggers determine when workflows are executed. A trigger
 * file describes a scenario in which a workflow should be run,
 * such as a user pressing a button or when a specific event occurs.
 * https://api.slack.com/automation/triggers
 */
const submitIssue: Trigger<typeof SubmitIssueWorkflow.definition> = {
  type: TriggerTypes.Shortcut,
  name: "Submit an issue",
  description: "Submit an issue to the channel",
  workflow: "#/workflows/submit_issue",
  inputs: {
    interactivity: {
      value: TriggerContextData.Shortcut.interactivity,
    },
    channel: {
      value: TriggerContextData.Shortcut.channel_id,
    },
  },
};

export default submitIssue;
