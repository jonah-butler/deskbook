function toggleSubLocation(dropdown, hiddenDropdown) {
  dropdown.addEventListener('change', function(e) {
    if(this.value === "main"){
      hiddenDropdown.classList.remove('hidden');
      hiddenDropdown.classList.add('show');
    } else {
      hiddenDropdown.classList.add('hidden');
    }
  })
}

export{ toggleSubLocation };
