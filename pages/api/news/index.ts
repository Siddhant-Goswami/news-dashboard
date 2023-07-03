import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { title, description } = req.body;
    console.log('Body', title, description);
    if (title && description) {
      try {
        const newsDescription = description;
        // console.log('siteBody', siteBody);
        // console.log('title', title);

        // langchain
        const model = new OpenAI({ temperature: 0.9 });
        const template =
          'You are a journalist of Times of india, Write a news article with the given information: {article}';
        const prompt = new PromptTemplate({
          template: template,
          inputVariables: ['article']
        });

        const chain = new LLMChain({ llm: model, prompt: prompt });
        const article = newsDescription;
        const summarisedResponse = await chain.call({ article });
        console.log('open ai', summarisedResponse, summarisedResponse.text);

        res.status(200).json({ text: summarisedResponse.text, title: title });
      } catch (error) {
        console.log('Err', error);
        res.status(500).json({ error: 'Error fetching the page' });
      }
    }
  } else {
    return new Response('Method Not Allowed', {
      headers: { Allow: 'POST' },
      status: 405
    });
  }
};
