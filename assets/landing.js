import { getLibcalEvents, buildEventCards, getReferenceData } from './scripts/landing-helpers.js';

const svgs = [
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF0066" d="M36.9,-66.2C42.7,-60.5,38.7,-40.3,35.6,-26.8C32.6,-13.4,30.3,-6.7,38.7,4.8C47.1,16.4,66.1,32.8,69.3,46.4C72.6,60.1,60,71.1,45.8,69.7C31.6,68.2,15.8,54.4,4.4,46.8C-7.1,39.3,-14.1,38,-21.9,35.7C-29.6,33.4,-38,30.1,-39.7,24C-41.3,17.8,-36.3,8.9,-38.7,-1.4C-41,-11.6,-50.7,-23.3,-53.8,-37.7C-56.9,-52.1,-53.4,-69.3,-43.4,-72.5C-33.3,-75.8,-16.6,-65.1,-0.6,-64.1C15.5,-63.1,31.1,-71.9,36.9,-66.2Z" transform="translate(100 100)" />
  </svg>`,
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
		<path fill="#FF0066" d="M31.7,-54.2C41.4,-49.2,49.9,-41.5,53.1,-32C56.3,-22.5,54.2,-11.2,56.4,1.3C58.7,13.8,65.3,27.7,63.5,39.7C61.8,51.7,51.7,61.9,39.7,66.5C27.7,71.1,13.9,70.1,2.6,65.6C-8.7,61.1,-17.3,53,-28.9,48.2C-40.5,43.4,-55.1,41.8,-63.9,34.3C-72.7,26.8,-75.7,13.4,-78.5,-1.6C-81.3,-16.6,-83.7,-33.2,-78.8,-47.4C-73.9,-61.6,-61.5,-73.4,-47.2,-75.8C-32.8,-78.1,-16.4,-71,-2.7,-66.3C11,-61.5,21.9,-59.3,31.7,-54.2Z" transform="translate(100 100)" />
	</svg>`,
  `<svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <path fill="#FF0066" d="M23.8,-29.5C36.6,-33.8,56.9,-39.2,69.8,-34.4C82.8,-29.7,88.4,-14.8,82.7,-3.3C77,8.3,59.9,16.5,50.3,27C40.7,37.5,38.5,50.2,31.4,54.3C24.2,58.4,12.1,53.7,4.5,46C-3.2,38.3,-6.4,27.5,-17.8,25.9C-29.2,24.3,-48.8,31.9,-54.2,29.1C-59.7,26.3,-51,13.2,-44.8,3.6C-38.7,-6.1,-35.1,-12.1,-31.1,-17.4C-27.1,-22.7,-22.7,-27.2,-17.4,-27.2C-12.2,-27.3,-6.1,-22.9,-0.3,-22.3C5.5,-21.8,10.9,-25.1,23.8,-29.5Z" transform="translate(100 100)" />
  </svg>`
];

const eventContainer = document.querySelector('.event-card-container');
const loader = document.querySelector('.loader');
const chart1 = document.querySelector('.chart1');
const chart2 = document.querySelector('.chart2');

async function fetchAndBuild() {
  let events = await getLibcalEvents();
  events = events.events;
  let cardHTML = '';
  let counter = 1;

  if(events.length){
    events.forEach((event) => {

      let gradientStr = 'gradient' + counter;

      if(counter >= 3){
        cardHTML += buildEventCards(event, `gradient${counter}`, svgs[counter-1]);
        counter = 1;
      } else {
        cardHTML += buildEventCards(event, `gradient${counter}`, svgs[counter-1]);
        counter++;
      }
    })

    loader.remove();
    eventContainer.insertAdjacentHTML('afterbegin', cardHTML);
  } else {
    const noEventsImg = document.createElement('img');
    noEventsImg.src = '/imgs/dog-meme.jpeg';
    noEventsImg.classList.add('no-events-default');
    loader.remove();
    eventContainer.appendChild(noEventsImg);
  }
  getReferenceData(chart1, chart2);
}
fetchAndBuild();
