import { initializeDatePickers, gatherData, fetchApi, buildData } from './scripts/reference-helpers.js';
import { clearResults, submitAnimationInit } from './scripts/dom-helpers.js';
import { sortData, setupDataForChart } from './scripts/client-helpers.js';
import { createCanvasAndAppend } from './scripts/canvas-helpers.js';
import { createChart } from './scripts/chart-helpers.js';

let branchBtn = document.querySelector('#branchDropdown');
let branchMenu = document.querySelector('.dropdown-menu');
let parentContainer = document.querySelector('.view-container')

let data;
let chartDataObj;

if(branchMenu){
  branchMenu.addEventListener('click', (e) => {
    branchBtn.innerText = e.target.innerText;
    branchBtn.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
  })
}

initializeDatePickers(document.querySelector('#date-input-start'), document.querySelector('#date-input-end'))


document.querySelector('.icon-circle').addEventListener('click', async function(e){
  data = gatherData();
  if(data != false){
    this.disabled = true;
    try {
      submitAnimationInit(this, 'clicked');
      const response = await fetchApi(`${document.location.protocol}//${document.location.host}/reference/search`, data);
      if(!response.length){
        clearResults(parentContainer);
        document.querySelector('.view-container').innerHTML = 'no data for this selected data range!';
        this.disabled = false;
        return;
      } else {
        clearResults(parentContainer);
        chartDataObj = setupDataForChart(response);
        buildData(response, parentContainer, Object.keys(chartDataObj), Object.keys(chartDataObj).map(key => chartDataObj[key]), true);
        this.disabled = false;
      }
    } catch(err) {
      console.log('fetch error', err);
    }
  } else {
    return;
  }
})
