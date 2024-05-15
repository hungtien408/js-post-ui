import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { setTextContent, truncateText } from './common';
// to use fromNow function
dayjs.extend(relativeTime);

export function createPostElement(post) {
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

export function renderPostList(elementId, postList) {
  if (!Array.isArray(postList)) return;

  const postListElement = document.getElementById(elementId);
  if (!postListElement) return;

  // clear current list
  postListElement.textContent = '';

  postList.forEach((post) => {
    const postElement = createPostElement(post);
    postListElement.appendChild(postElement);
  });
}
