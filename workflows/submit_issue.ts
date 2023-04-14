import { DefineWorkflow, Schema } from "deno-slack-sdk/mod.ts";
import { CreateIssueMessage } from "../functions/create_issue_message.ts";

/**
 * A workflow is a set of steps that are executed in order.
 * Each step in a workflow is a function.
 * https://api.slack.com/future/workflows
 */
const SubmitIssueWorkflow = DefineWorkflow({
  callback_id: "submit_issue",
  title: "Submit an issue",
  description: "Submit an issue to the channel",
  input_parameters: {
    properties: {
      interactivity: {
        type: Schema.slack.types.interactivity,
      },
      channel: {
        type: Schema.slack.types.channel_id,
      },
    },
    required: ["channel"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.slack.types.rich_text,
      },
    },
    required: ["message"],
  },
});

/**
 * For collecting input from users, we recommend the
 * built-in OpenForm function as a first step.
 * https://api.slack.com/future/functions#open-a-form
 */
const inputForm = SubmitIssueWorkflow.addStep(
  Schema.slack.functions.OpenForm,
  {
    title: "Submit an issue",
    interactivity: SubmitIssueWorkflow.inputs.interactivity,
    submit_label: "Submit",
    fields: {
      elements: [{
        name: "severity",
        title: "Severity of issue",
        type: Schema.types.string,
        enum: [":white_circle:", ":large_blue_circle:", ":red_circle:"],
        choices: [
          {
            value: ":white_circle:",
            title: ":white_circle:  Low",
            description: "Low severity",
          },
          {
            value: ":large_blue_circle:",
            title: ":large_blue_circle:  Medium",
            description: "Medium severity",
          },
          {
            value: ":red_circle:",
            title: ":red_circle:  High",
            description: "High severity",
          },
        ],
      }, {
        name: "description",
        title: "Description of issue",
        type: Schema.types.string,
        long: true,
      }, {
        name: "link",
        title: "Relevant link or URL",
        type: Schema.types.string,
      }],
      required: ["severity", "description"],
    },
  },
);

/**
 * Custom functions are reusable building blocks
 * of automation deployed to Slack infrastructure. They
 * accept inputs, perform calculations, and provide
 * outputs, just like typical programmatic functions.
 * https://api.slack.com/future/functions/custom
 */
const createIssueStep = SubmitIssueWorkflow.addStep(
  CreateIssueMessage,
  {
    interactivity: inputForm.outputs.interactivity,
    severity: inputForm.outputs.fields.severity,
    description: inputForm.outputs.fields.description,
    link: inputForm.outputs.fields.link,
  },
);

/**
 * SendMessage is a Slack function. These are built-in
 * Slack-native actions, like creating a channel or sending
 * a message and can be used alongside custom functions in a workflow.
 * https://api.slack.com/future/functions
 */
SubmitIssueWorkflow.addStep(Schema.slack.functions.SendMessage, {
  channel_id: SubmitIssueWorkflow.inputs.channel,
  message: createIssueStep.outputs.message,
});

export default SubmitIssueWorkflow;
