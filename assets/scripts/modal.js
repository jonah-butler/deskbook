function loadModal(data = {}) {
  const modal = document.querySelector('#Modal');
  const modalContentCont = modal.querySelector('.modal-content-container');

  modal.style.display = "block";
  modal.onclick = function(e) {
    if(e.target.className == 'modal' || e.target.className == 'close'){
      modal.style.display = "none";
      // modalContentCont.removeChild(document.querySelector('.video-wrapper'));
    }
  }
    // submitReference();
  }

  // export { loadModal };

function modalClickListener(button, callback) {
  if(button){
    button.
    addEventListener('click', function(e) {
      const modal = document.querySelector('#Modal');
      const modalContentCont = modal.querySelector('.modal-content-container');

      modal.style.display = "block";
      modal.onclick = function(e) {
        if(e.target.className == 'modal' || e.target.className == 'close'){
          modal.style.display = "none";
          // modalContentCont.removeChild(document.querySelector('.video-wrapper'));
        }
      }
        callback();
    })
  }
}

export { modalClickListener };
