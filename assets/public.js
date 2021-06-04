import { fetchAndBuild } from './scripts/landing-helpers.js';


let cardConts = document.querySelectorAll('.bookmark-card-full-container');
const eventContainer = document.querySelector('.event-card-container');
const loader = document.querySelector('.loader');

Array.from(cardConts).forEach((cardCont) => {
  cardCont.addEventListener('click', (e) => {
    if(!e.target.classList.contains('fas')){
      cardCont.querySelector('.bookmark-card').classList.toggle('flipped');
    }
  })
})


fetchAndBuild(eventContainer, loader);
