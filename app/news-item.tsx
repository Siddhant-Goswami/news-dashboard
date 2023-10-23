import { TabGroup, TabList, Tab } from '@tremor/react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { useSearch } from '../lib/search-context';
import { useEffect, useState } from 'react';

interface News {
  id: number;
  name: string;
  description: string;
  content: string;
  author: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

function fetchImage(imageId: string) {
  return new Promise((resolve, reject) => {
    fetch(
      `https://cricbuzz-cricket.p.rapidapi.com/img/v1/i1/c${imageId}/i.jpg?p=det`,
      {
        method: 'GET',
        headers: {
          'X-RapidAPI-Key': process.env.RAPID_KEY as string,
          'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
        }
      }
    )
      .then((response) => response.blob())
      .then((blob) => {
        const imageUrl = URL.createObjectURL(blob);
        resolve(imageUrl);
      })
      .catch(reject);
  });
}
export default function NewsItem({ news }: { news: any }) {
  const { searchText, setSearchText, newsItem, setNewsItem } = useSearch();

  function handleSearch(item: any) {
    setNewsItem(item);
    //setSearchText(item?.links);
  }

  const [images, setImages] = useState<Record<string, string>>({});

  useEffect(() => {
    news.forEach(({ story }: any) => {
      fetchImage(story.imageId)
        .then((imageUrl) => {
          setImages((prevImages) => ({
            ...prevImages,
            [story.imageId]: imageUrl
          }));
        })
        .catch((error) => {
          console.error('Failed to fetch image:', error);
        });
    });
  }, [news]);

  return (
    <section
      aria-labelledby="product-heading"
      className="mt-6 lg:col-span-2 lg:mt-0 xl:col-span-3"
    >
      <h2 id="product-heading" className="sr-only">
        Products
      </h2>
      <TabGroup>
        <TabList className="my-8">
          <Tab icon={ArrowTrendingUpIcon}>Trending</Tab>
        </TabList>
      </TabGroup>

      <div className="grid grid-cols-1 gap-y-4 sm:grid-cols-2 sm:gap-x-6 sm:gap-y-10 lg:gap-x-8 xl:grid-cols-3">
        {news?.map(({ story }: { story: any }) => {
          return (
            <div
              onClick={() => handleSearch(story)}
              key={story?.id}
              className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
            >
              <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96 cursor-pointer">
                <img
                  src={images[story.imageId]}
                  className="h-full w-full object-cover object-center sm:h-full sm:w-full"
                />
              </div>
              <div className="flex flex-1 flex-col space-y-2 p-4">
                <h3 className="text-sm font-medium text-gray-900">
                  {story.seoHeadline}
                </h3>
                <p className="text-sm text-gray-500">{story.intro}</p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
