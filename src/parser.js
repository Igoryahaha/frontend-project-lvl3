const parser = new DOMParser();

export default (rss, url) => {
  const parsedDoc = parser.parseFromString(rss.data.contents, 'application/xml');
  if (parsedDoc.querySelector('parsererror')) {
    throw new Error('parseError');
  }
  const feedTitle = parsedDoc.querySelector('channel>title').textContent;
  const feedDescription = parsedDoc.querySelector('channel>description').textContent;
  const postTitles = Array.from(parsedDoc.querySelectorAll('item>title')).map((item) => item.textContent);
  const postLinks = Array.from(parsedDoc.querySelectorAll('item>link')).map((item) => item.textContent);
  const postDescr = Array.from(parsedDoc.querySelectorAll('item>description')).map((item) => item.textContent);
  const posts = postTitles.reduce((acc, _, index) => {
    acc.push({
      title: postTitles[index],
      link: postLinks[index],
      description: postDescr[index],
    });
    return acc;
  }, []);

  const feed = {
    title: feedTitle,
    description: feedDescription,
    url,
  };

  return {
    ...feed,
    posts,
  };
};
