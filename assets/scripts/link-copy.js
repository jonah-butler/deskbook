function linkCopy() {
  // let url = document.location.href;
  navigator.clipboard.writeText(document.location.href)
  // .then(() => { alert(`Copied!`) })
  // .catch((error) => { alert(`Copy failed! ${error}`) })
}

function animatingStateInit(btn, parent) {
  let animating = false;
  btn.addEventListener('click', (e) => {
    if(animating == false) {
      linkCopy();
      animating = true;
      let flashBox = createFlashBox('text copied to cliboard');
      console.log(flashBox);
      document.body.appendChild(flashBox);
      flashBox.style.top = `${window.scrollY}px`;
      flashBox.classList.add('show');
      setTimeout(function() {
      //  flashBox.classList.remove('show');
       flashBox.remove();
       animating = false;
      }, 2000);
    }
  })
}

function createFlashBox(text) {
  let flashBox = document.createElement('div');
  flashBox.classList.add('flash-message');
  flashBox.innerText = text;
  return flashBox;
}

export { animatingStateInit }