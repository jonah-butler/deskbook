function linkCopy() {
  // let url = document.location.href;
  navigator.clipboard.writeText(document.location.href)
  // .then(() => { alert(`Copied!`) })
  // .catch((error) => { alert(`Copy failed! ${error}`) })
}

function animateFlashBox(text){
  let animating = false;
  if(animating == false) {
    animating = true;
    let flashBox = createFlashBox(text);
    document.body.appendChild(flashBox);
    flashBox.style.top = `${window.scrollY + 50}px`;
    flashBox.classList.add('show');
    setTimeout(function() {
    //  flashBox.classList.remove('show');
     flashBox.remove();
     animating = false;
   }, 5000);
  }
}

function animatingStateInit(btn, parent, text) {
  let animating = false;
  btn.addEventListener('click', (e) => {
    if(animating == false) {
      linkCopy();
      animating = true;
      let flashBox = createFlashBox(text);
      console.log(flashBox);
      document.body.appendChild(flashBox);
      flashBox.style.top = `${window.scrollY + 50}px`;
      flashBox.classList.add('show');
      setTimeout(function() {
      //  flashBox.classList.remove('show');
       flashBox.remove();
       animating = false;
     }, 4000);
    }
  })
}

function createFlashBox(text) {
  let flashBox = document.createElement('div');
  flashBox.classList.add('flash-message');
  flashBox.innerText = text;
  return flashBox;
}

export { animatingStateInit, linkCopy, animateFlashBox }
