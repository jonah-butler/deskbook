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
