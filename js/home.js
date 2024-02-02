import postApi from './api/postApi';
import { setTextContent, truncateText } from './utils';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

// to use fromNow function
dayjs.extend(relativeTime);

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
    setTextContent(liElement, '[data-id="description"]', truncateText(post.description, 100));
    setTextContent(liElement, '[data-id="author"]', post.author);

    // calculate timespan
    var timeSpan = dayjs(post.updatedAt).fromNow();
    setTextContent(liElement, '[data-id="timeSpan"]', ` - ${timeSpan}`);

    const thumbnailElement = liElement.querySelector('[data-id="thumbnail"]');
    if (thumbnailElement) {
      thumbnailElement.src = post.imageUrl;

      thumbnailElement.addEventListener('error', () => {
        thumbnailElement.src = 'https://via.placeholder.com/1368x400?text=thumbnail';
      });
    }

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
