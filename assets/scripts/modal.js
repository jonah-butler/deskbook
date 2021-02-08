function modalClickListener(buttonArr, callback) {
  if(buttonArr){
    Array.
    from(buttonArr).
    forEach((node) => {
    node.
    addEventListener('click', function(e) {
      const modal = document.querySelector('#Modal');
      const modalContentCont = modal.querySelector('.modal-content-container');

      modal.style.display = "block";
      modal.onclick = function(e) {
        if(e.target.className == 'modal' || e.target.className == 'close'){
          modal.style.display = "none";
        }
      }
        callback();
    })
  })
  }
}

export { modalClickListener };
