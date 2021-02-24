function modalClickListener() {
      const modal = document.querySelector('#Modal');
      const modalContentCont = modal.querySelector('.modal-content-container');

      modal.style.display = "block";
      modal.onclick = function(e) {
        if(e.target.className == 'modal' || e.target.className == 'close'){
          modal.style.display = "none";
        }
      }
}

function closeModal(modal) {
    modal.style.display = "none";
    modal.querySelector('#defaultBranchSelect').setAttribute('selected', true);
}

function resetModalForms(modal) {
  modal.querySelector('#defaultBranchSelect').removeAttribute('selected');
  modal.querySelector('#defaultBranchSelect').setAttribute('selected', 'selected');
  modal.querySelector('#questionLength').checked = false;
  modal.querySelector('#referenceDescription').value = '';
}

export { modalClickListener, closeModal, resetModalForms };
