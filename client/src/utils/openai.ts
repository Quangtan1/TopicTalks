import { OpenAI } from 'openai';

const OPENAI_API_KEY = `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`;

export const openAi = new OpenAI({ apiKey: OPENAI_API_KEY, dangerouslyAllowBrowser: true });

export const getRecommendedTopic = async (content: string) => {
  try {
    const prompt = `Given the following content:\n${content}\nPlease suggest a relevant topic.`;

    const completion = await openAi.chat.completions.create({
      messages: [{ role: 'user', content: prompt }],
      model: 'gpt-3.5-turbo',
    });
    const suggestedTopic = completion.choices[0].message.content;
    return suggestedTopic;
  } catch (error) {
    console.error('Error fetching topic suggestion:', error);
  }
};
