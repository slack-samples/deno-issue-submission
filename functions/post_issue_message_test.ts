import { SlackFunctionTester } from "deno-slack-sdk/mod.ts";
import handler from "./post_issue_message.ts";
import { stub } from "@std/testing/mock";
import { assertEquals } from "@std/assert/equals";

const { createContext } = SlackFunctionTester("my-function");

Deno.test("Posts a message", async () => {
  using _fetchStub = stub(
    globalThis,
    "fetch",
    async (url: string | URL | Request, options?: RequestInit) => {
      const request = url instanceof Request ? url : new Request(url, options);
      const body = await request.formData();

      assertEquals(request.method, "POST");
      assertEquals(request.url, "https://slack.com/api/chat.postMessage");
      assertEquals(body.get("channel"), "C111");

      return Promise.resolve(
        new Response(JSON.stringify({ ok: true }), {
          status: 200,
        }),
      );
    },
  );

  const inputs = {
    channel: "C111",
    submitting_user: "U111",
    severity: "low",
    description: "there ware an issue",
    link: "https://example.ca",
  };
  const { outputs } = await handler(createContext({ inputs }));
  assertEquals(outputs, {
    channel: "C111",
    description: "there ware an issue",
    link: "https://example.ca",
    severity: "low",
    submitting_user: "U111",
  });
});
