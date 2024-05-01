import OpenAI from "openai";
import { interaktionsdesignBachPrompt } from "./interaktionsdesign_bach_prompt";
import { informationsteknologiBachPrompt } from "./informationsteknologi_bach_prompt";
import { medialogiBachPrompt } from "./medialogi_bach_prompt";
import { interaktionsdesignKandPrompt } from "./interaktionsdesign_kand_prompt";
import { medialogiKandPrompt } from "./medialogi_kand_prompt";
import { computerScienceKandPrompt } from "./computer_science_kand_prompt";

const openai = new OpenAI({
  apiKey: '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',
  dangerouslyAllowBrowser: true
});

export async function OpenAIchat(prompt, conversationHistory = [], chatbotID) {

  let systemMessageContent;
  if (chatbotID === 'Interaktionsdesign, Bachelor') {
    systemMessageContent = interaktionsdesignBachPrompt;
  } else if (chatbotID === 'Informationsteknologi, Bachelor') {
    systemMessageContent = informationsteknologiBachPrompt;
  } else if (chatbotID === 'Medialogi, Bachelor') {
    systemMessageContent = medialogiBachPrompt;
  } else if (chatbotID === 'Interaktionsdesign, Kandidat') {
    systemMessageContent = interaktionsdesignKandPrompt;
  } else if (chatbotID === 'Medialogy, Kandidat') {
    systemMessageContent = medialogiKandPrompt;
  } else if (chatbotID === 'Computer Science (IT), Kandidat') {
    systemMessageContent = computerScienceKandPrompt;
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