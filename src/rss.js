import axios from 'axios';
import { uniqueId } from 'lodash';
import parser from './parser';

const proxifyURL = (urlIn) => {
  const result = new URL('https://allorigins.hexlet.app/get');
  result.searchParams.set('disableCache', 'true');
  result.searchParams.set('url', urlIn);
  return result.href;
};

export default (watchedState, url) => axios
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
