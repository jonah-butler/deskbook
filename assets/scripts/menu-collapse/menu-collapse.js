function toggleSideMenu(target, btn){
  btn.addEventListener('click', (e) => {
    target.classList.toggle('open');
  })
}

export {toggleSideMenu};
