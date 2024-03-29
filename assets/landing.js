import { getReferenceData, fetchAndBuild } from './scripts/landing-helpers.js';


const eventContainer = document.querySelector('.event-card-container');
const loader = document.querySelector('.loader');
const lineChart = document.querySelector('.hour-chart');
const chart1 = document.querySelector('.chart1');
const chart2 = document.querySelector('.chart2');

fetchAndBuild(eventContainer, loader);
getReferenceData(chart1, chart2, lineChart);
$(document).ready(function(){
  $('[data-toggle="tooltip"]').tooltip();
});
