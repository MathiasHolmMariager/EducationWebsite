import OpenAI from "openai";
import { reverseSearchContext } from "./openai-context";

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export async function OpenAIchat(prompt) {
  const completion = await openai.chat.completions.create({
    messages: [
      { role: "user", content: prompt },
      { role: "assistant", content: reverseSearchContext,}
    ],
    model: "gpt-3.5-turbo",
  });

  const assistantReply = completion.choices[0].message.content;
  return assistantReply;
}