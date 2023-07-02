import { TabGroup, TabList, Tab, TabPanels, TabPanel } from '@tremor/react';
import { ArrowTrendingUpIcon } from '@heroicons/react/24/solid';
import { usePathname, useRouter } from 'next/navigation';
import { useSearch } from '../lib/search-context';

interface News {
  id: number;
  name: string;
  description: string;
  author: string;
  imageSrc: string;
  imageAlt: string;
  href: string;
}

export default function NewsItem({ news }: { news: News[] }) {
  const { searchText, setSearchText } = useSearch();

  function handleSearch(url: string) {
    setSearchText(url);
  }

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
        {news.map((item) => (
          <div
            onClick={() => handleSearch(item.href)}
            key={item.id}
            className="group relative flex flex-col overflow-hidden rounded-lg border border-gray-200 bg-white"
          >
            <div className="aspect-h-4 aspect-w-3 bg-gray-200 sm:aspect-none group-hover:opacity-75 sm:h-96 cursor-pointer">
              <img
                src={item.imageSrc}
                alt={item.imageAlt}
                className="h-full w-full object-cover object-center sm:h-full sm:w-full"
              />
            </div>
            <div className="flex flex-1 flex-col space-y-2 p-4">
              <h3 className="text-sm font-medium text-gray-900">{item.name}</h3>
              <p className="text-sm text-gray-500">{item.description}</p>

              <div
                onClick={() => {
                  window.open(item.href, '_blank');
                }}
                className="flex flex-1 flex-col justify-end cursor-pointer"
              >
                <p className="text-sm italic text-blue-500">Read full story</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
