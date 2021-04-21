import { fullRender, initializeDatePickers, gatherData, fetchApi, buildData, printBranchTotals, sortDropDown } from './scripts/reference-helpers.js';
import { clearResults, submitAnimationInit } from './scripts/dom-helpers.js';
import { createCanvasAndAppend } from './scripts/canvas-helpers.js';
import { createChart } from './scripts/chart-helpers.js';


  let branchBtn = document.querySelector('#branchDropdown');
  let branchMenu = document.querySelector('.dropdown-menu');
  let parentContainer = document.querySelector('.view-container');
  let todayBtn = document.querySelector('#today');
  let tomorrowBtn = document.querySelector('#tomorrow');
  const inputStart = document.querySelector('#date-input-start');
  const inputEnd = document.querySelector('#date-input-end');

  let data;
  let chartDataObj;

  if(branchMenu){
    branchMenu.addEventListener('click', (e) => {
      branchBtn.innerText = e.target.innerText;
      branchBtn.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
    })
  }

  initializeDatePickers(inputStart, inputEnd);

  async function fetchReference() {
    document.querySelector('.icon-circle').addEventListener('click', async function(e){
      data = gatherData();
      if(data != false){
        this.disabled = true;
        try {
          submitAnimationInit(this, 'clicked');
          const response = await fetchApi(`${document.location.protocol}//${document.location.host}/reference/search`, data);
          if(!response.length){
            clearResults(parentContainer);
            parentContainer.innerHTML = 'no data for this selected data range!';
            this.disabled = false;
            return;
          } else {
            fullRender(parentContainer, response, false, true);
            this.disabled = false;
          }
        } catch(err) {
          console.log('fetch error', err);
        }
      } else {
        return;
      }
    })
  }

  async function fetchToday() {
    todayBtn.addEventListener('click', (e) => {
      let today = new Date();
      today = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
      inputStart.value = today;
      inputEnd.value = today;
      document.querySelector('.icon-circle').click();
    })
  }

  async function fetchTomorrow() {
    tomorrowBtn.addEventListener('click', (e) => {
      let yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday = `${yesterday.getMonth() + 1}/${yesterday.getDate()}/${yesterday.getFullYear()}`;
      inputStart.value = yesterday;
      inputEnd.value = yesterday;
      document.querySelector('.icon-circle').click();
    })
  }

  fetchReference();
  fetchToday();
  fetchTomorrow();
  todayBtn.click();
