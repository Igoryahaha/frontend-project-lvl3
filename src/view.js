const renderMessage = ({ messageType, message }, form, i18nInstance) => {
  const p = form.querySelector('.feedback');
  const input = form.querySelector('input');

  switch (messageType) {
    case 'success':
      input.classList.remove('is-invalid');
      p.classList.remove('text-danger');
      p.classList.add('text-success');
      break;

    case 'error':
      input.classList.add('is-invalid');
      p.classList.remove('text-success');
      p.classList.add('text-danger');
      break;

    default:
      throw new Error(`Unknown messageType: '${messageType}'!`);
  }

  switch (message) {
    case 'SuccessAdding':
      p.textContent = i18nInstance.t(`messages.${message}`);
      form.reset();
      input.focus();
      break;

    case 'invalidURL':
    case 'parseError':
    case 'duplicate':
    case 'downloadError':
    case 'Network Error':
    case 'required':
      p.textContent = i18nInstance.t(`messages.${message}`);
      break;

    default:
      throw new Error(`Unknown message: '${message}'!`);
  }
  form.append(p);
};

const renderFeeds = (feeds, elements, i18nInstance) => {
  const container = elements.feeds;
  container.textContent = '';

  const title = document.createElement('h3');
  title.textContent = i18nInstance.t('feeds');
  title.classList.add('px-3');
  container.append(title);

  const feedList = document.createElement('ul');
  feedList.classList.add('list-group', 'border-0');

  const feedItems = feeds.map((feed) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0');

    const itemTitle = document.createElement('h4');
    itemTitle.textContent = feed.title;
    itemTitle.classList.add('h6');

    const itemDesc = document.createElement('p');
    itemDesc.classList.add('small', 'text-black-50');
    itemDesc.textContent = feed.description;

    item.append(itemTitle, itemDesc);

    return item;
  });

  feedList.append(...feedItems.reverse());
  container.append(feedList);
};

const renderPosts = (posts, elements, i18nInstance) => {
  const container = elements.posts;
  container.textContent = '';

  const title = document.createElement('h3');
  title.textContent = i18nInstance.t('posts');
  title.classList.add('px-3');
  container.append(title);

  const postList = document.createElement('ul');
  postList.classList.add('list-group', 'border-0');

  const postItems = posts.map((post) => {
    const item = document.createElement('li');
    item.classList.add('list-group-item', 'border-0', 'd-flex', 'justify-content-between', 'align-items-start');
    const link = document.createElement('a');
    link.classList.add('fw-bold');
    link.setAttribute('href', post.link);
    link.setAttribute('target', '_blank');
    link.setAttribute('data-id', post.id);
    link.textContent = post.title;
    const button = document.createElement('button');
    button.classList.add('btn', 'btn-outline-primary', 'btn-sm');
    button.textContent = i18nInstance.t('buttons.view');
    button.setAttribute('type', 'button');
    button.setAttribute('data-bs-toggle', 'modal');
    button.setAttribute('data-bs-target', '#modal');
    button.setAttribute('data-id', post.id);
    item.append(link, button);

    return item;
  });

  postList.append(...postItems);
  container.append(postList);
};

const renderModal = (inboxId, posts) => {
  const modalPost = posts.filter(({ id }) => id === inboxId)[0];
  const modal = document.querySelector('#modal');

  const modalTitle = modal.querySelector('.modal-title');
  modalTitle.textContent = modalPost.title;

  const modalBody = modal.querySelector('.modal-body');
  modalBody.textContent = modalPost.description;

  const articleLinkButton = modal.querySelector('.full-article');
  articleLinkButton.setAttribute('href', modalPost.link);
};

const markRead = (postIds) => {
  postIds.forEach((postId) => {
    const link = document.querySelector(`a[data-id="${postId}"]`);
    link.classList.remove('fw-bold');
    link.classList.add('fw-normal', 'link-secondary');
  });
};

export {
  renderMessage, renderPosts, renderFeeds, renderModal, markRead,
};
