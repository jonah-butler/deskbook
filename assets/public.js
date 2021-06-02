let cardConts = document.querySelectorAll('.bookmark-card-full-container');


Array.from(cardConts).forEach((cardCont) => {
  cardCont.addEventListener('click', (e) => {
    if(!e.target.classList.contains('fas')){
      cardCont.querySelector('.bookmark-card').classList.toggle('flipped');
    }
  })
})
