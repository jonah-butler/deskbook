function modalClickListener() {
      const modal = document.querySelector('#Modal');
      const modalContentCont = modal.querySelector('.modal-content-container');

      modal.style.display = "block";
      modal.onclick = function(e) {
        if(e.target.className == 'modal' || e.target.className == 'close'){
          modal.style.display = "none";
        }
      }
        // callback(modal);
        // modal.style.display = "none";
}

export { modalClickListener };
