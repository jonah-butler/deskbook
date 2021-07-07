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
          // hiddenField.querySelector('#defaultSubSelect').setAttribute('value', hiddenField.querySelector('#defaultSubSelect').innerText);
        } else {
          hiddenField.classList.add('hidden');
          hiddenField.querySelector('#defaultSubSelect').setAttribute('value', '');
          hiddenField.removeAttribute('value');
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
  let defaultBranchSelect = modal.querySelector('#defaultBranchSelect');

  defaultBranchSelect.removeAttribute('selected');
  defaultBranchSelect.setAttribute('selected', 'selected');

  if(defaultBranchSelect.getAttribute('data-library')){

    let libraryPref = defaultBranchSelect.getAttribute('data-library');
    defaultBranchSelect.value = libraryPref;
    defaultBranchSelect.innerText = libraryPref;

    if(libraryPref === 'main') {

      let subLocationContainer = document.querySelector('#mainSubContainer');
      let subLocationSelect = document.querySelector('#mainSubLocation');
      let subLocationDefault = document.querySelector('#defaultSubSelect');
      let subLocationPref = subLocationContainer.getAttribute('data-sublocation');

      if(subLocationContainer.classList.contains('hidden')){
        subLocationContainer.classList.remove('hidden');
        subLocationContainer.classList.add('show');
      }

      subLocationSelect.value = subLocationPref;
      subLocationDefault.selected = 'selected';
      subLocationDefault.value = subLocationPref;
    } else {
      console.log('here');
      // reset main sub location selection field
      if(modal.querySelector('#mainSubContainer').classList.contains('show')){
        modal.querySelector('#defaultSubSelect').removeAttribute('selected');
        modal.querySelector('#defaultSubSelect').setAttribute('selected', 'selected');
        modal.querySelector('#mainSubContainer').classList.remove('show');
        modal.querySelector('#mainSubContainer').classList.add('hidden');
      }
    }
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
