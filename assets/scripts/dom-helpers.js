function clearResults(parentElement) {
  parentElement.innerHTML = '';
}

function submitAnimationInit(ele, newClass) {
  ele.classList.add(newClass);
  setTimeout(() => {
    ele.classList.remove(newClass);
  }, 500);
}

export { clearResults, submitAnimationInit };
