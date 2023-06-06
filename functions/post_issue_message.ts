import { DefineFunction, Schema } from "deno-slack-sdk/mod.ts";
import { SlackFunction } from "deno-slack-sdk/mod.ts";

/**
 * Functions are reusable building blocks of automation that accept
 * inputs, perform calculations, and provide outputs. Functions can
 * be used independently or as steps in workflows.
 * https://api.slack.com/automation/functions/custom
 */
export const PostIssueMessage = DefineFunction({
  callback_id: "post_issue_message",
  title: "Post an issue to channel",
  description: "Create an issue message from submitted form",
  source_file: "functions/post_issue_message.ts",
  input_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
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
    required: ["submitting_user", "severity", "description", "channel"],
  },
  output_parameters: {
    properties: {
      channel: {
        type: Schema.slack.types.channel_id,
      },
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
});

/**
 * SlackFunction takes in two arguments: the CustomFunction
 * definition (see above), as well as a function that contains
 * handler logic that's run when the function is executed.
 * https://api.slack.com/automation/functions/custom
 */
export default SlackFunction(
  PostIssueMessage,
  async ({ inputs, client }) => {
    const { channel, severity, description, link, submitting_user } = inputs;
    const severityEmoji: { [key: string]: string } = {
      low: ":white_circle:",
      medium: ":large_blue_circle:",
      high: ":red_circle:",
    };

    // Send a message to channel using a nicely formatted
    // message using block elements from Block Kit.
    // https://api.slack.com/block-kit
    await client.chat.postMessage({
      channel,
      blocks: [
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `${
              severityEmoji[severity]
            } *Issue submission from <@${submitting_user}>*`,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Description of the issue:*\n${description}\n\n`,
          },
        },
        {
          "type": "section",
          "text": {
            "type": "mrkdwn",
            "text": `*Relevant link or URL:*\n${link || "N/A"}\n\n`,
          },
        },
      ],
    });

    // Return all inputs as outputs for consumption in subsequent functions
    return {
      outputs: { channel, severity, description, submitting_user, link },
    };
  },
);
