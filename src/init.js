import onChange from 'on-change';
import i18next from 'i18next';
import * as yup from 'yup';
import resources from './locales/ru.js';
import {
  renderMessage,
  renderFeeds,
  renderPosts,
  renderModal,
  markRead,
} from './view';
import { getRss, updateRss } from './rss.js';

const updateTimeout = 5000;

const validation = (url, feeds) => {
  yup.setLocale({
    mixed: {
      notOneOf: 'duplicate',
      required: 'required',
    },
    string: {
      url: 'invalidURL',
    },
  });

  const schema = yup.object({
    url: yup.string().required().url().notOneOf(feeds),
  });

  return schema.validate(url)
    .then((data) => data)
    .catch((e) => e);
};

export default () => {
  const i18nInstance = i18next.createInstance();

  const elements = {
    form: document.querySelector('.rss-form'),
    input: document.getElementById('url-input'),
    button: document.getElementById('btn-submit'),
    posts: document.querySelector('.posts'),
    feeds: document.querySelector('.feeds'),
  };

  i18nInstance
    .init({
      lng: 'ru',
      debug: false,
      resources,
    })
    .then((t) => t);

  const state = {
    feeds: [],
    posts: [],
    readedPosts: [],
    form: {
      message: '',
      modalId: '',
      process: 'filling',
      messageType: '',
    },
  };

  const addModalEvents = (watchedState) => Array
    .from(document.querySelectorAll('button[data-bs-toggle="modal"]'))
    .map((btn) => btn.addEventListener('click', () => {
      watchedState.form.modalId = btn.dataset.id;
      watchedState.readedPosts.push(btn.dataset.id);
      watchedState.form.process = 'modal';
    }));

  const watchedState = onChange(state, (path, value) => {
    switch (state.form.process) {
      case 'filling':
        elements.input.removeAttribute('readonly');
        elements.button.disabled = false;
        break;

      case 'successfully':
        renderMessage(state.form, elements.form, i18nInstance);

        elements.input.removeAttribute('readonly');
        elements.button.disabled = false;
        renderFeeds(state.feeds, elements, i18nInstance);
        renderPosts(state.posts, elements, i18nInstance);
        addModalEvents(watchedState);
        break;

      case 'loading':
        elements.input.setAttribute('readonly', true);
        elements.button.disabled = true;
        break;

      case 'error':
        renderMessage(state.form, elements.form, i18nInstance);
        elements.input.removeAttribute('readonly');
        elements.button.disabled = false;
        break;

      case 'updated':
        renderPosts(state.posts, elements, i18nInstance);
        addModalEvents(watchedState);
        break;

      case 'modal':
        renderModal(state.form.modalId, state.posts);
        markRead(state.readedPosts);
        break;

      default:
        throw new Error(value);
    }
  });

  const autoUpdateRss = () => updateRss(watchedState)
    .then(() => {
      setTimeout(autoUpdateRss, updateTimeout);
    })
    .catch((e) => console.log('Update RSS error!', e));

  autoUpdateRss();

  elements.form.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const url = { url: formData.get('url') };
    const feedsUrls = state.feeds.map((feed) => feed.url);

    validation(url, feedsUrls)
      .then((data) => {
        if (data.url) {
          watchedState.process = 'loading';
          getRss(watchedState, data.url)
            .then(() => {
              watchedState.form.message = 'SuccessAdding';
              watchedState.form.messageType = 'success';
              watchedState.form.process = 'successfully';
            })
            .catch((error) => {
              watchedState.form.message = error.message;
              watchedState.form.messageType = 'error';
              watchedState.form.process = 'error';
            });
        } else {
          watchedState.form.message = data.message;
          watchedState.form.messageType = 'error';
          watchedState.form.process = 'error';
        }
      });
  });
};
