function modalToggle(modal) {
  modal.classList.toggle('show');
}

function grabImgSrc(imgClickEvent){
  return imgClickEvent.srcElement.currentSrc;
}

function appendImgToModal(modal, img){
  modal.append(img);
}

function createImg(imgSrc){
  let img = document.createElement('img');
  img.setAttribute('src', imgSrc);
  img.classList.add('s3-responsive');
  return img;
}

function closeListener(modal){
  modal.querySelector('.close').addEventListener('click', () => {
    clearImg(modal.querySelector('img'));
    modalToggle(modal);
    preventBgScroll();
  })
}

function clearImg(img){
  img.remove();
}

function preventBgScroll(){
  document.body.classList.toggle('stop-scrolling');
}

export {modalToggle, grabImgSrc, appendImgToModal, createImg, closeListener, clearImg, preventBgScroll};
