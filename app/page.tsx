'use client';

import { Card, Title, Text, Button } from '@tremor/react';
import { useEffect, useState } from 'react';
import Search from './search';
import Toast from './toast';

import NewsItem from './news-item';
import TextCard from './text-card';
import SlideoverMenu from './slideover-menu';

import { useSearch } from '../lib/search-context';
import { isValidUrl } from '../lib/utils';

const API_KEY = '298b0ef74a974050bc98ca61cac50d48'; // replace with your API key
const BASE_URL = 'https://newsapi.org/v2';

const getTopHeadlines = async (country = 'bbc-news') => {
  try {
    // const response = await fetch(
    //   `${BASE_URL}/top-headlines?sources=${country}&apiKey=${API_KEY}`
    // );
    // const data = await response.json();
    const data = NEWSDATA;
    const headlines = data.articles.map((item: any, i: number) => ({
      id: i,
      name: item.title,
      description: item.description,
      content: item.content,
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

const generateNews = async (title: string, description: string) => {
  try {
    const apiURL = '/api/news';
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ title: title, description: description })
    };

    const response = await fetch(apiURL, options);
    const data = await response.json();
    return data;
  } catch (err) {
    console.error('err', err);
    return '';
  }
};

type ResultType = {
  text: string;
  title: string;
};

type NewsType = {
  id: number;
  name: string;
  description: string;
  content: string;
  author: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
};

export default async function IndexPage({
  searchParams
}: {
  searchParams: { q: string };
}) {
  const [news, setNews] = useState<NewsType[]>([]);
  const [results, setResults] = useState();

  const [loading, setLoading] = useState(false);
  const { searchText, setSearchText } = useSearch();
  const { newsItem, setNewsItem } = useSearch();
  const [open, setOpen] = useState(true);

  useEffect(() => {
    initNews();
  }, []);

  useEffect(() => {
    // console.log('news', newsItem, open);
    setOpen(true);
  }, [newsItem]);

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

  const handleNewsGenration = async () => {
    setLoading(true);
    try {
      const result = await generateNews(newsItem.name, newsItem.description);
      // console.log('result', result);
      setResults(result);
    } catch (error) {
      setSearchText('');
      setLoading(false);
    }
  };

  return (
    <main className="p-4 md:p-10 mx-auto max-w-7xl">
      <Title>AI News Generator</Title>
      <Text>Enter BBC article link below</Text>
      <div className="flex gap-4 mt-4">
        <Search />
        <Button loading={loading} variant="secondary" onClick={handleCrawl}>
          Generate News
        </Button>
      </div>
      <div className="mt-6">
        {results ? (
          <>
            <TextCard results={results} />
            <Toast />
          </>
        ) : (
          <NewsItem news={news} />
        )}
        {newsItem ? (
          <SlideoverMenu
            newsItem={newsItem}
            openMenu={open}
            handleGenerate={handleCrawl}
          />
        ) : (
          <></>
        )}
      </div>
    </main>
  );
}

const NEWSDATA = {
  status: 'ok',
  totalResults: 10,
  articles: [
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'France riots: Police and protesters clash in Marseille',
      description:
        'France is battling with a fifth night of unrest, with heavy clashes between police and rioters in Marseille.',
      url: 'http://www.bbc.co.uk/news/live/world-europe-66073728',
      urlToImage:
        'https://m.files.bbci.co.uk/modules/bbc-morph-news-waf-page-meta/5.3.0/bbc_news_logo.png',
      publishedAt: '2023-07-02T07:22:23.1721396Z',
      content:
        "Laurence in NeuillyImage caption: Laurence in Neuilly\r\nThe suburb of Neuilly-sur-Seine is a far cry from Nanterre, where\r\nthe protests have been centred.\r\nAlthough it's only about 5km (three miles) a… [+1013 chars]"
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'Ukraine finds British WW2 Hurricane planes outside Kyiv',
      description:
        'London sent the Hawker Hurricanes to the Soviet Union to help them fight against Nazi Germany.',
      url: 'http://www.bbc.co.uk/news/world-europe-65955365',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/5537/production/_130151812_cleaningatmuseum-1.jpg',
      publishedAt: '2023-07-02T05:07:15.9323784Z',
      content:
        'The rusting remains of eight British Hurricane fighter planes dating back to World War Two have been found buried in a forest in Ukraine.\r\nThe aircraft were sent to the Soviet Union by Britain after … [+3980 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'Shell still trading Russian gas despite pledge to stop',
      description:
        'The firm is still shipping gas from Siberia despite its promise to withdraw from the Russian energy market.',
      url: 'http://www.bbc.co.uk/news/business-66021325',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/17FE8/production/_130208289_zubov-index-alamy2ec5xn6.jpg',
      publishedAt: '2023-07-01T23:52:15.7304799Z',
      content:
        "Shell is still trading Russian gas more than a year after pledging to withdraw from the Russian energy market.\r\nThe company was involved in nearly an eighth of Russia's shipborne gas exports in 2022,… [+4230 chars]"
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC Sport',
      title: "Dutch driver Van 't Hoff, 18, dies in crash at Spa",
      description:
        "Dutch racing driver Dilano van 't Hoff dies after a crash at the Formula Regional European Championship by Alpine.",
      url: 'http://www.bbc.co.uk/sport/motorsport/66076074',
      urlToImage:
        "https://ichef.bbci.co.uk/live-experience/cps/624/cpsprodpb/934A/production/_130260773_dilanovan'thoff.jpg",
      publishedAt: '2023-07-01T23:07:21.0326558Z',
      content:
        "Dilano van 't Hoff was racing in wet conditions at the Spa-Francorchamps circuit in Belgium\r\nDutch racing driver Dilano van 't Hoff has died after a crash at a race in the Formula Regional European C… [+1568 chars]"
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'California reparations: How do you put a price on racism?',
      description:
        'The state of California is considering giving the descendants of slaves $1.2m each.',
      url: 'http://www.bbc.co.uk/news/world-us-canada-66058835',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/54A0/production/_130246612_pearlandalvintaylor.jpg',
      publishedAt: '2023-07-01T23:07:18.9797069Z',
      content:
        'Alvin Taylor and his sister, Pearl, were kids when the City of Palm Springs, California began burning down their neighbours\' homes. But they still remember the smell of the smoke.\r\n"We would come hom… [+9612 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'Ukraine war corrosive for Vladimir Putin - CIA boss',
      description:
        'William J Burns says dissatisfaction with the conflict in Russia is a valuable recruiting tool.',
      url: 'http://www.bbc.co.uk/news/world-europe-66076564',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/10320/production/_130263366_1214b1cc1830f2b1bc8822c9ef450b821d0b1d790_0_7050_46421000x658.jpg',
      publishedAt: '2023-07-01T20:22:18.8890294Z',
      content:
        'The Ukraine war is having a "corrosive" effect on Vladimir Putin\'s leadership of Russia, according to the head of the Central Intelligence Agency (CIA).\r\nRussian disaffection over the war is providin… [+3476 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title:
        "Dutch King Willem-Alexander apologises for country's role in slavery",
      description:
        'King Willem-Alexander calls slavery a "horror" and says sorry for his family\'s failure to act.',
      url: 'http://www.bbc.co.uk/news/world-europe-66076562',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/132B4/production/_130261587_gettyimages-1377751529.jpg',
      publishedAt: '2023-07-01T19:52:15.5739128Z',
      content:
        'The King of the Netherlands has formally apologised for his country\'s role in the slave trade, saying he felt "personally and intensely" affected.\r\nThe country became a major colonial power after the… [+2763 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: 'Helicopter pulls stranded firefighter from sinking boat',
      description:
        'The boat had stalled and went over the edge of a dam during a rescue mission in New Jersey in the US.',
      url: 'http://www.bbc.co.uk/news/world-us-canada-66077414',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/CF22/production/_130262035_p0fyg080.jpg',
      publishedAt: '2023-07-01T19:52:13.9805592Z',
      content:
        'A police helicopter was sent to rescue a group firefighters whose boat had stalled on a river in the US.\r\nThe firefighters had been called to rescue a team of construction workers after their boat ma… [+512 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title:
        'Twitter temporarily restricts tweets users can see, Elon Musk announces',
      description:
        'Elon Musk says verified accounts can read up to 6,000 posts a day while unverified ones are limited to 600.',
      url: 'http://www.bbc.co.uk/news/technology-66077195',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/171C1/production/_130075649_twitter_sign_reuters.jpg',
      publishedAt: '2023-07-01T18:07:18.0428712Z',
      content:
        'Twitter has applied a temporary limit to the number of tweets users can read in a day, owner Elon Musk has said.\r\nIn a tweet, Mr Musk said unverified accounts can read up to 600 posts a day. \r\nMeanwh… [+589 chars]'
    },
    {
      source: {
        id: 'bbc-news',
        name: 'BBC News'
      },
      author: 'BBC News',
      title: "Paris riots: What we know about teen's shooting by police",
      description:
        'Prosecutors are due to interview a witness after he posted a version of events online.',
      url: 'http://www.bbc.co.uk/news/world-europe-66075798',
      urlToImage:
        'https://ichef.bbci.co.uk/news/1024/branded_news/3719/production/_130250141__130224324_microsoftteams-image-3.png',
      publishedAt: '2023-07-01T14:52:21.2921828Z',
      content:
        'Prosecutors have begun piecing together what happened before the fatal shooting of 17-year-old Nahel M by a police officer.\r\nThe officer has been charged with homicide and remains in custody.\r\nIn the… [+3161 chars]'
    }
  ]
};
