import postApi from './api/postApi';
import { setTextContent } from './utils';

function createPostElement(post) {
  if (!post) return null;

  try {
    // find template
    const postTemplate = document.getElementById('postItemTemplate');
    if (!postTemplate) return null;

    // clone li element
    const liElement = postTemplate.content.firstElementChild.cloneNode(true);
    if (!liElement) return null;

    // update title, description, author, thumbnail
    setTextContent(liElement, '[data-id="title"]', post.title);
    setTextContent(liElement, '[data-id="description"]', post.description);
    setTextContent(liElement, '[data-id="author"]', post.author);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) thumbnailElement.src = post.imageUrl;

    // attach events

    return liElement;
  } catch (error) {
    console.log('failed to create post item', error);
  }
}

function renderPostList(postList) {
  if (!Array.isArray(postList) || postList.length === 0) return;

  const postListElement = document.getElementById('postList');
  if (!postListElement) return;

  postList.forEach((post) => {
    const postElement = createPostElement(post);
    postListElement.appendChild(postElement);
  });
}

(async () => {
  try {
    const queryParams = {
      _page: 1,
      _limit: 6,
    };
    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast
  }
})();
