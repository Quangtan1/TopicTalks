import { OpenAI } from 'openai';

// TODO: add new API key here
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
