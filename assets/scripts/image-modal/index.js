import {modalToggle, grabImgSrc, appendImgToModal, createImg, closeListener, clearImg, preventBgScroll} from './image-modal.js';

const modal = document.querySelector('.img-modal');
const s3Imgs = document.querySelectorAll('.fr-fic');

if(s3Imgs.length){
  closeListener(modal);
  Array.from(s3Imgs).forEach((img) => {
    img.addEventListener('click', (e) => {
      modalToggle(modal);
      preventBgScroll();
      const imgSrc = grabImgSrc(e);
      const img = createImg(imgSrc);
      appendImgToModal(modal, img);
    })
  })
}
