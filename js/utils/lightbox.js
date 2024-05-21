function showModal(modalElement) {
  if (!window.bootstrap) return;

  const modal = new window.bootstrap.Modal(modalElement);
  if (modal) modal.show();
}

export function registerLightBox({ modalId, imgSelector, prevSelector, nextSelector }) {
  const modalElement = document.getElementById(modalId);
  if (!modalElement) return;

  // selectors
  const imgElement = modalElement.querySelector(imgSelector);
  const prevButton = modalElement.querySelector(prevSelector);
  const nextButton = modalElement.querySelector(nextSelector);
  if (!imgElement || !prevButton || !nextButton) return;

  // lightbox vars
  let imgList = [];
  let currentIndex = 0;

  function showImageAtIndex(index) {
    imgElement.src = imgList[index].src;
  }

  // handle click for all imgs
  // img click => find all imgs with the same album/gallery
  // determine index of selected img
  // show modal with selected img
  // handle prev / next click

  document.addEventListener('click', (event) => {
    const { target } = event;
    if (target.tagName != 'IMG' || !target.dataset.album) return;

    // img with data-album
    imgList = document.querySelectorAll(`img[data-album="${target.dataset.album}"]`);
    currentIndex = [...imgList].findIndex((x) => x === target);
    console.log('album image click', { target, currentIndex, imgList });
    showImageAtIndex(currentIndex);
    showModal(modalElement);
  });

  prevButton.addEventListener('click', () => {
    // show prev image of current album
  });

  nextButton.addEventListener('click', () => {
    // show next image of current album
  });
}
