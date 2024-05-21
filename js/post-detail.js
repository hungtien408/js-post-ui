import dayjs from 'dayjs';
import postApi from './api/postApi';
import { setTextContent } from './utils';
import { registerLightBox } from './utils/lightbox';

function renderPostDetail(post) {
  if (!post) return;

  // render title
  setTextContent(document, '#postDetailTitle', post.title);

  // render description
  setTextContent(document, '#postDetailDescription', post.description);

  // render author
  setTextContent(document, '#postDetailAuthor', post.author);

  // render updatedAt
  setTextContent(
    document,
    '#postDetailTimeSpan',
    dayjs(post.updatedAt).format(' - DD/MM/YYYY HH:mm'),
  );

  // render hero image
  const heroImage = document.getElementById('postHeroImage');
  if (heroImage) {
    heroImage.style.backgroundImage = `url("${post.imageUrl}")`;

    heroImage.addEventListener('error', () => {
      heroImage.style.backgroundImage = `url("https://via.placeholder.com/1368x400?text=thumbnail")`;
    });
  }

  // render edit page link
  const editPageLinkElement = document.getElementById('goToEditPageLink');
  if (editPageLinkElement) {
    editPageLinkElement.href = `/add-edit-post.html?id=${post.id}`;
    editPageLinkElement.innerHTML = '<i class="fas fa-edit"></i> Edit post';
  }
}

(async () => {
  registerLightBox({
    modalId: 'lightbox',
    imgSelector: 'img[data-id="lightboxImg"]',
    prevSelector: 'button[data-id="lightboxPrev"]',
    nextSelector: 'button[data-id="lightboxNext"]',
  });

  try {
    // get post id from URL
    const searchParams = new URLSearchParams(window.location.search);
    const postId = searchParams.get('id');
    if (!postId) return;

    // fetch post detail API
    const data = await postApi.getById(postId);

    // render post detail
    renderPostDetail(data);
  } catch (error) {
    console.log('Failed to fetch post detail', error);
  }
})();
