import axios from 'axios';
import { uniqueId, differenceWith, isEqual } from 'lodash';
import parser from './parser';

const proxifyURL = (urlIn) => {
  const result = new URL('https://allorigins.hexlet.app/get');
  result.searchParams.set('disableCache', 'true');
  result.searchParams.set('url', urlIn);
  return result.href;
};

const getRss = (watchedState, url) => axios
  .get(proxifyURL(url))
  .then((response) => {
    const data = parser(response, url);
    const feedId = uniqueId();

    watchedState.feeds.push({
      id: feedId,
      ...data,
    });

    const feedPosts = data.posts.map((post) => ({
      id: uniqueId(),
      feedId,
      ...post,
    }));

    watchedState.posts.unshift(...feedPosts);
  })
  .catch((e) => {
    throw e;
  });

const updateRss = (watchedState) => {
  const promises = watchedState.feeds.reverse().map((feed) => axios
    .get(proxifyURL(feed.url))
    .then((response) => {
      const data = parser(response.data.contents);

      const feedItems = data.items.map((item) => ({
        id: uniqueId(),
        feedId: feed.id,
        ...item,
      }));

      const oldItemsLinks = watchedState.posts
        .filter((item) => item.feedId === feed.id)
        .map(({ link }) => link);

      const newItemsLinks = feedItems.map(({ link }) => link);
      const differentItemsLinks = differenceWith(newItemsLinks, oldItemsLinks, isEqual);
      const differentItems = feedItems.filter(({ link }) => differentItemsLinks.includes(link));

      if (differentItems.length > 0) {
        watchedState.posts.unshift(...differentItems);
        watchedState.form.process = 'updated';
      }
    })
    .catch((e) => e));
  return Promise.all(promises);
};

export { getRss, updateRss };
