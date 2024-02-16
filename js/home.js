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

function renderPagination(pagination) {
  const ulPagination = document.getElementById('postsPagination');
  if (!pagination || !ulPagination) return;

  // calc totalPages
  const { _page, _limit, _totalRows } = pagination;
  var totalPages = Math.ceil(_totalRows / _limit);

  // save page and totalPages to ulPagination
  ulPagination.dataset.page = _page;
  ulPagination.dataset.totalPages = totalPages;

  // check if enable/disable prev links
  if (_page <= 1) {
    ulPagination.firstElementChild?.classList.add('disabled');
  } else {
    ulPagination.firstElementChild?.classList.remove('disabled');
  }

  // check if enable/disable next links
  if (_page >= totalPages) {
    ulPagination.lastElementChild?.classList.add('disabled');
  } else {
    ulPagination.lastElementChild?.classList.remove('disabled');
  }
}

function handleFilterChange(filterName, filterValue) {
  // update query params
  const url = new URL(window.location);
  url.searchParams.set(filterName, filterValue);
  history.pushState({}, '', url);

  // fetch API
  // re-render post list
}

function handlePrevClick(e) {
  e.preventDefault();
  console.log('prev link');
}

function handleNextClick(e) {
  e.preventDefault();
  console.log('next link');
}

function initPagination() {
  // bind click event for prev/next link
  const ulPagination = document.getElementById('postsPagination');
  if (!ulPagination) return;

  // add click event for prev link
  const prevLink = ulPagination.firstElementChild?.firstElementChild;
  if (prevLink) {
    prevLink.addEventListener('click', handlePrevClick);
  }

  // add click event for next link
  const nextLink = ulPagination.lastElementChild?.lastElementChild;
  if (nextLink) {
    nextLink.addEventListener('click', handleNextClick);
  }
}

function initUrl() {
  const url = new URL(window.location);

  // update search params if needed
  if (!url.searchParams.get('_page')) {
    url.searchParams.set('_page', 1);
  }

  if (!url.searchParams.get('_limit')) {
    url.searchParams.set('_limit', 6);
  }

  history.pushState({}, '', url);
}

(async () => {
  try {
    initPagination();
    initUrl();

    // get query params in the url
    const queryParams = new URLSearchParams(window.location.search);

    // set default query params if not existed
    if (!queryParams) {
      queryParams = {
        _page: 1,
        _limit: 6,
      };
    }

    const { data, pagination } = await postApi.getAll(queryParams);
    renderPostList(data);
    renderPagination(pagination);
  } catch (error) {
    console.log('get all failed', error);
    // show modal, toast
  }
})();
