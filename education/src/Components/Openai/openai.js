import OpenAI from "openai";
import { interaktionsdesignBachPrompt } from "./interaktionsdesign_bach_prompt";

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export async function OpenAIchat(prompt, conversationHistory = []) {
  const localStorageValue = localStorage.getItem('PAGE_ID');

  let systemMessageContent;
  if (localStorageValue === 'Interaktionsdesign, Bachelor') {
    systemMessageContent = interaktionsdesignBachPrompt;
  } else {
    systemMessageContent = "Du er en hjælpsom chatbot der skal agere studievejleder og hjælpe folk med at få information om bacheloruddannelser og kandidatuddannelser.";
  }

  const completion = await openai.chat.completions.create({
    messages: [
      { role: "system", content: systemMessageContent },
      ...conversationHistory,
      { role: "user", content: prompt }
    ],
    model: "gpt-3.5-turbo",
  });

  const assistantReply = completion.choices[0].message.content;
  conversationHistory.push({ role: "assistant", content: assistantReply });

  return { assistantReply, conversationHistory };
}