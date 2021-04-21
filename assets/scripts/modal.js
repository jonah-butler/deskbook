function modalClickListener() {
      const modal = document.querySelector('#Modal');
      const modalContentCont = modal.querySelector('.modal-content-container');
      const branchSelect = modal.querySelector('#branchLocation');

      modal.style.display = "block";

      branchSelect.addEventListener('change', function(e) {
        const hiddenField = modal.querySelector('#mainSubContainer')
        if(this.value === "main"){
          hiddenField.classList.remove('hidden');
          hiddenField.classList.add('show');
        } else {
          hiddenField.classList.add('hidden');
        }
      })

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
  // reset location selection field
  modal.querySelector('#defaultBranchSelect').removeAttribute('selected');
  modal.querySelector('#defaultBranchSelect').setAttribute('selected', 'selected');
  // reset main sub location selection field
  if(modal.querySelector('#mainSubContainer').classList.contains('show')){
    modal.querySelector('#defaultSubSelect').removeAttribute('selected');
    modal.querySelector('#defaultSubSelect').setAttribute('selected', 'selected');
    modal.querySelector('#mainSubContainer').classList.remove('show');
    modal.querySelector('#mainSubContainer').classList.add('hidden');
  }
  // remove check from overFiveMinutes checkbox
  modal.querySelector('#questionLength').checked = false;
  // empty description textarea field
  modal.querySelector('#referenceDescription').value = '';
  // remove reference type radio selection
  modal.querySelector('input[name="question[refType]"]:checked').checked = false;
  // remove answer type radio selection
  modal.querySelector('input[name="question[answeredHow]"]:checked').checked = false;
  // reset scroll position
  modal.querySelector('.modal-content').scrollTop = '0';
}

export { modalClickListener, closeModal, resetModalForms };
