import { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'node-fetch';
import axios from 'axios';

export default async (req: NextApiRequest, res: NextApiResponse) => {
    if (req.method === 'GET') {

        const options = {
            method: 'GET',
            url: 'https://cricbuzz-cricket.p.rapidapi.com/news/v1/index',
            headers: {
                'X-RapidAPI-Key': process.env.RAPID_KEY as string,
                'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
            }
        };


        try {
            const response = await axios.request(options);
            res.status(200).json({ data: response.data });
        } catch (error) {
            return res.json({ error: error });
        }
    } else {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }
};
