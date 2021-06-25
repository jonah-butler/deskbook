function linkCopy(param = document.location.href) {
  // let url = document.location.href;
  navigator.clipboard.writeText(param);
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
   }, 4000);
  }
}

function animatingStateInit(btn, text, textToCopy) {
  let animating = false;
  let handler = function(e) {
    if(animating == false) {
      linkCopy(textToCopy);
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
  }
  btn.addEventListener('click', handler);
  return handler;
}

function createFlashBox(text) {
  let flashBox = document.createElement('div');
  flashBox.classList.add('flash-message');
  flashBox.innerText = text;
  return flashBox;
}

export { animatingStateInit, linkCopy, animateFlashBox };
