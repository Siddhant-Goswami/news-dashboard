import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import cheerio from 'cheerio';
import { OpenAI } from 'langchain/llms/openai';
import { PromptTemplate } from 'langchain/prompts';
import { LLMChain } from 'langchain/chains';

export default async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method === 'POST') {
    const { url } = req.body;
    console.log('url', url);
    if (url) {
      try {
        const response = await fetch(url);
        const body = await response.text();
        const $ = cheerio.load(body);
        const content: string[] = [];

        $('article p').each(function (i, elem) {
          content[i] = $(this).text();
        });

        const siteBody = content.join('\n\n');
        const title = $('article header h1').text();

        // langchain
        const model = new OpenAI({ temperature: 0.9 });
        const template =
          'You are a journalist of Times of india, Write a news article in 600 words using the given article: {article}';
        const prompt = new PromptTemplate({
          template: template,
          inputVariables: ['article']
        });

        const chain = new LLMChain({ llm: model, prompt: prompt });
        const article = siteBody;
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
