function formatDatesForDatePickers(date) {
  if(date instanceof Date){
    return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`
  } else {
    return new Error('invalid date param, use Date class');
  }
}

function toggleButtonDisabled(btn) {
  return btn.disabled = !btn.disabled;
}

function buildLoader(parentContainer) {
  const loader = `<div class="loader">
  					<div class="loader-inner">
  						<div></div><div></div><div></div>
  					</div>
  				</div>`;
  parentContainer.insertAdjacentHTML('afterbegin', loader);
  return parentContainer.firstChild;
}

function removeLoader(loader) {
  loader.remove();
}

export { formatDatesForDatePickers, toggleButtonDisabled, buildLoader, removeLoader };
