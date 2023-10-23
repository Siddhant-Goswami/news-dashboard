/*
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
*/
import { Fragment, useState, useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import {
  LinkIcon,
  PlusIcon,
  QuestionMarkCircleIcon,
  ExclamationCircleIcon,
  LockClosedIcon
} from '@heroicons/react/20/solid';
import axios from 'axios';

const team = [
  {
    name: 'Tom Cook',
    email: 'tom.cook@example.com',
    href: '#',
    imageUrl: 'https://www.6rs.co.uk/wp-content/uploads/2021/10/Beeb.png'
  }
];

export default async function Example({
  newsItem,
  openMenu,
  handleGenerate
}: {
  newsItem: any;
  openMenu: boolean;
  handleGenerate: any;
}) {
  const [open, setOpen] = useState(openMenu);
  const [newsDetail, setNewsDetail] = useState<any>(null);

  useEffect(() => {
    console.log('news', newsItem, open);
    setOpen(openMenu);
    getNewsDetails();
  }, [newsItem]);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    handleGenerate(content);
    setOpen(false);
  }
  function filterAndConcatenate(data: any) {
    let paragraph = '';

    data?.forEach((item: any) => {
      if (item.content && item.content.contentType === 'text') {
        paragraph += item.content.contentValue + '\n\n';
      }
    });

    return paragraph.trim();
  }

  const getNewsDetails = async () => {
    const options = {
      method: 'GET',
      url: `https://cricbuzz-cricket.p.rapidapi.com/news/v1/detail/${newsItem.id}`,
      headers: {
        'X-RapidAPI-Key': process.env.RAPID_KEY as string,
        'X-RapidAPI-Host': 'cricbuzz-cricket.p.rapidapi.com'
      }
    };

    try {
      const response = await axios.request(options);
      setNewsDetail(response.data);
    } catch (error) {
      console.error(error);
    }
  };
  const content = filterAndConcatenate(newsDetail?.content);

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog as="div" className="relative z-10" onClose={setOpen}>
        <div className="fixed inset-0" />

        <div className="fixed inset-0 overflow-hidden">
          <div className="absolute inset-0 overflow-hidden">
            <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-10 sm:pl-16">
              <Transition.Child
                as={Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <Dialog.Panel className="pointer-events-auto w-screen max-w-md">
                  <form
                    className="flex h-full flex-col divide-y divide-gray-200 bg-white shadow-xl"
                    onSubmit={handleSubmit}
                  >
                    <div className="h-0 flex-1 overflow-y-auto">
                      <div className="bg-gray-50 px-4 py-6 sm:px-6">
                        <div className="flex items-center justify-between">
                          <Dialog.Title className="text-base font-semibold leading-6 text-gray-900">
                            AI Generated News
                          </Dialog.Title>
                          <div className="ml-3 flex h-7 items-center">
                            <button
                              type="button"
                              className="text-gray-400 hover:text-gray-500"
                              onClick={() => setOpen(false)}
                            >
                              <span className="sr-only">Close panel</span>
                              <XMarkIcon
                                className="h-6 w-6"
                                aria-hidden="true"
                              />
                            </button>
                          </div>
                        </div>
                        <div className="mt-1">
                          <p className="text-sm text-gray-500">
                            Get started by filling in the information below to
                            generate your news.
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="divide-y divide-gray-200 px-4 sm:px-6">
                          <div className="space-y-6 pb-5 pt-6">
                            <div>
                              <label
                                htmlFor="project-name"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Title
                              </label>
                              <div className="mt-2">
                                <input
                                  readOnly
                                  value={newsItem.seoHeadline}
                                  type="text"
                                  name="project-name"
                                  id="project-name"
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-500 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>

                            <fieldset>
                              <legend className="text-sm font-medium leading-6 text-gray-900">
                                LLM (Large Language Model)
                              </legend>
                              <div className="mt-2 space-y-4">
                                <div className="relative flex items-start">
                                  <div className="absolute flex h-6 items-center">
                                    <input
                                      id="privacy-public"
                                      name="privacy"
                                      aria-describedby="privacy-public-description"
                                      type="radio"
                                      className="h-4 w-4 border-gray-300 text-blue-500"
                                      defaultChecked
                                    />
                                  </div>
                                  <div className="pl-7 text-sm leading-6">
                                    <label
                                      htmlFor="privacy-public"
                                      className="font-medium text-gray-900"
                                    >
                                      GPT-3.5-turbo
                                    </label>
                                    {/* <p
                                      id="privacy-public-description"
                                      className="text-gray-500"
                                    >
                                      Everyone with the link will see this
                                      project.
                                    </p> */}
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="privacy-private-to-project"
                                        name="privacy"
                                        aria-describedby="privacy-private-to-project-description"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-500"
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label
                                        htmlFor="privacy-private-to-project"
                                        className="font-medium text-gray-900"
                                      >
                                        GPT-4
                                      </label>
                                      {/* <p
                                        id="privacy-private-to-project-description"
                                        className="text-gray-500"
                                      >
                                        Only members of this project would be
                                        able to access.
                                      </p> */}
                                    </div>
                                  </div>
                                </div>
                                <div>
                                  <div className="relative flex items-start">
                                    <div className="absolute flex h-6 items-center">
                                      <input
                                        id="privacy-private"
                                        name="privacy"
                                        aria-describedby="privacy-private-to-project-description"
                                        type="radio"
                                        className="h-4 w-4 border-gray-300 text-blue-500"
                                      />
                                    </div>
                                    <div className="pl-7 text-sm leading-6">
                                      <label
                                        htmlFor="privacy-private"
                                        className="font-medium text-gray-900"
                                      >
                                        Anthropic-Claude-100k
                                      </label>
                                      {/* <p
                                        id="privacy-private-description"
                                        className="text-gray-500"
                                      >
                                        Premium
                                      </p> */}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </fieldset>
                            <div>
                              {/* <h3 className="text-sm font-medium leading-6 text-gray-900">
                                Sources
                              </h3>
                              <div className="mt-2">
                                <div className="flex space-x-2">
                                  {team.map((person) => (
                                    <a
                                      key={person.email}
                                      href={person.href}
                                      className="rounded-full hover:opacity-75"
                                    >
                                      <img
                                        className="inline-block h-8 w-8 rounded-full"
                                        src={person.imageUrl}
                                        alt={person.name}
                                      />
                                    </a>
                                  ))}
                                  <button
                                    type="button"
                                    title="Support for adding more sources is comming soon."
                                    className="inline-flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border-2 border-dashed border-gray-200 bg-white text-gray-400 hover:border-gray-300 hover:text-gray-500"
                                  >
                                    <span className="sr-only">
                                      Add more sources
                                    </span>
                                    <PlusIcon
                                      className="h-5 w-5"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </div>
                              </div> */}
                              <div className="pb-4 pt-4">
                                <div className="flex text-sm">
                                  <a
                                    href="#"
                                    className="group inline-flex items-center font-medium text-blue-500 hover:text-blue-600 w-full"
                                  >
                                    <LinkIcon
                                      className="h-5 w-5 text-blue-500 group-hover:text-blue-600"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-2 truncate">
                                      {newsDetail?.appIndex?.webURL}
                                    </span>
                                  </a>
                                </div>
                                {/* <div className="mt-4 flex text-sm">
                                  <a
                                    href="#"
                                    className="group inline-flex items-center text-xs text-gray-500 hover:text-gray-900"
                                  >
                                    <ExclamationCircleIcon
                                      className="h-6 w-6 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />

                                    <span className="ml-2">
                                      By default source of the news is BBC.
                                      Support for adding more sources is comming
                                      soon.
                                    </span>
                                  </a>
                                </div> */}
                                {/* <div className="mt-4 flex text-sm">
                                  <a
                                    href="#"
                                    className="group inline-flex items-center text-gray-500 hover:text-gray-900"
                                  >
                                    <LockClosedIcon
                                      className="h-5 w-5 text-gray-400 group-hover:text-gray-500"
                                      aria-hidden="true"
                                    />
                                    <span className="ml-2">Generate Video</span>
                                  </a>
                                </div> */}
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Content
                              </label>
                              <div className="mt-2">
                                <textarea
                                  readOnly
                                  value={content}
                                  placeholder="Enter personal insights to the news. (optional)"
                                  id="description"
                                  name="description"
                                  rows={16}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                            <div>
                              <label
                                htmlFor="description"
                                className="block text-sm font-medium leading-6 text-gray-900"
                              >
                                Insights
                              </label>
                              <div className="mt-2">
                                <textarea
                                  readOnly
                                  // value={newsItem.description}
                                  placeholder="Enter personal insights to the news. (optional)"
                                  id="description"
                                  name="description"
                                  rows={4}
                                  className="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-gray-400 sm:text-sm sm:leading-6"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-shrink-0 justify-end px-4 py-4">
                      <button
                        type="button"
                        className="rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50"
                        onClick={() => setOpen(false)}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="ml-4 inline-flex justify-center rounded-md bg-blue-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600"
                      >
                        Generate News
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
