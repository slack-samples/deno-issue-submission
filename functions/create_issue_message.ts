import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const CreateIssueMessage = DefineFunction({
  callback_id: "create_issue_message",
  title: "Create an issue message",
  description: "Create an issue message from submitted form",
  source_file: "functions/create_issue_message.ts",
  input_parameters: {
    properties: {
      submitting_user: {
        type: Schema.slack.types.user_id,
      },
      severity: {
        type: Schema.types.string,
        description: "Severity of the issue",
      },
      description: {
        type: Schema.types.string,
        description: "Description of the issue",
      },
      link: {
        type: Schema.types.string,
        description: "Relevant link or URL",
      },
    },
    required: ["submitting_user", "severity", "description"],
  },
  output_parameters: {
    properties: {
      message: {
        type: Schema.slack.types.rich_text,
        description: "Message to channel",
      },
    },
    required: ["message"],
  },
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  CreateIssueMessage,
  ({ inputs }) => {
    const { severity, description, link, submitting_user } = inputs;
    let message =
      `*${severity}  Issue submission from <@${submitting_user}>* \n\n*Description of the issue:*\n${description}\n\n`;

    if (link) {
      message += `*Relevant link or URL:*\n${link}\n\n`;
    }
    return { outputs: { message } };
  },
);
