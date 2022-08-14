import axios from 'axios';
import { uniqueId } from 'lodash';

const proxifyURL = (urlIn) => {
  const result = new URL('https://allorigins.hexlet.app/get');
  result.searchParams.set('disableCache', 'true');
  result.searchParams.set('url', urlIn);
  return result.href;
};

export default (watchedState, url) => axios
  .get(proxifyURL(url))
  .then((response) => {
    if (response.data.status.http_code !== 200) {
      throw new Error('parseError');
    }
    watchedState.feeds.push({ data: response, url, id: uniqueId() });
  })
  .catch((e) => {
    throw e;
  });
