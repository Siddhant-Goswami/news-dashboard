'use client';

import { Card, Title, Text, Button } from '@tremor/react';
import { useEffect, useState } from 'react';
import Search from './search';
import NewsItem from './news-item';
import TextCard from './text-card';

import { useSearch } from '../lib/search-context';
import { isValidUrl } from '../lib/utils';

const API_KEY = '298b0ef74a974050bc98ca61cac50d48'; // replace with your API key
const BASE_URL = 'https://newsapi.org/v2';

const getTopHeadlines = async (country = 'bbc-news') => {
  try {
    const response = await fetch(
      `${BASE_URL}/top-headlines?sources=${country}&apiKey=${API_KEY}`
    );
    const data = await response.json();
    const headlines = data.articles.map((item, i) => ({
      id: i,
      name: item.title,
      description: item.description,
      author: item.author,
      imageSrc: item.urlToImage,
      imageAlt: item.title,
      href: item.url
    }));
    console.log(data);
    return headlines;
  } catch (error) {
    console.error(error);
    return [];
  }
};

const scrape = async (url: string) => {
  try {
    const apiURL = '/api/scrape';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ url: url })
    };

    const response = await fetch(apiURL, options);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('err', err);
    return '';
  }
};

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [news, setNews] = useState([]);
  const [results, setResults] = useState({});

  const [loading, setLoading] = useState(false);
  const { searchText, setSearchText } = useSearch();

  useEffect(() => {
    initNews();
  }, []);

  const initNews = async () => {
    const newsResponse = await getTopHeadlines();
    setNews(newsResponse);
  };

  const handleCrawl = async () => {
    setLoading(true);
    if (isValidUrl(searchText)) {
      const result = await scrape(searchText);
      console.log('result', result);
      setResults(result);
    } else {
      alert('invalid URL');
    }
    setSearchText('');
    setLoading(false);
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>AI News Generator</Title>
      <Text>Enter BBC article link below</Text>
      <div className="flex gap-4 mt-4">
        <Search />
        <Button loading={loading} variant="secondary" onClick={handleCrawl}>
          Start
        </Button>
      </div>
      <div className="mt-6">
        {results.text ? (
          <TextCard results={results} />
        ) : (
          <NewsItem news={news} />
        )}
      </div>
    </main>
  );
}
