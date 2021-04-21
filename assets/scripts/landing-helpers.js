import { createCanvasAndAppend } from './canvas-helpers.js';
import { createChart } from './chart-helpers.js';
import { sortDataAZ, setupDataForChart } from './client-helpers.js';
import { fetchApi } from './reference-helpers.js';


async function getLibcalEvents() {
  try{
    let response = await fetch("/calendarClient");
    response = await response.json();
    let tokenResponse = await fetch('https://rvalibrary.libcal.com/1.1/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: '570',
        client_secret: response.clientSecret,
        grant_type: 'client_credentials'
      }),
      headers: {
        'Content-type': 'application/json'
      }
    });
    tokenResponse = await tokenResponse.json();

    const events = await fetch(`https://rvalibrary.libcal.com/1.1/events?cal_id=14747&days=0`, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      }
    });
    const jsonEvents = await events.json();
    return jsonEvents;
  } catch(error){
    console.log(error);
  };
};

function buildEventCards(event, gradientName, gradient) {

  const date = new Date();

  let start = new Date(event.start);
  start = new Intl.DateTimeFormat('en-us', {timeStyle: 'short'}).format(start);

  let end = new Date(event.end);
  end = new Intl.DateTimeFormat('en-us', {timeStyle: 'short'}).format(end);

  return `
    <div class="event-panel fg1 ${gradientName}">
      ${gradient}
      <div class="event-panel-title">
        <h5>${event.title}</h5>
      </div>
      <div class="event-panel-date">
        ${date.toDateString()}
      </div>
      <div class="event-panel-time">
        ${start} - ${end}
      </div>
      <a target="blank" href="${event.url.public}" class="btn-chevron color-white absolute-bottom-right"><i class="fas fa-chevron-right"></i></a>
    </div>`;
};

function appendTotals(parentContainer, data) {
  parentContainer.querySelector('.total-container').innerText = data.length;
};

async function getReferenceData(container1, container2) {
  const today = new Date();
  const weekAgo = new Date(Date.now() - 604800000);
  let dateStrToday = `${today.getMonth() + 1}/${today.getDate()}/${today.getFullYear()}`;
  let dateStrWeekAgo = `${weekAgo.getMonth() + 1}/${weekAgo.getDate()}/${weekAgo.getFullYear()}`;
  const todayData = await fetchApi('/reference/search', {createdAt: [dateStrToday, dateStrToday], library: 'all'});
  const weeklyData = await fetchApi('/reference/search', {createdAt: [dateStrWeekAgo, dateStrToday], library: 'all'});
  let chartDataToday = setupDataForChart(todayData);
  let chartDataWeekly = setupDataForChart(weeklyData)
  const canvas1 = createCanvasAndAppend('canvas1', container1);
  const canvas2 = createCanvasAndAppend('canvas2', container2);
  if(Object.keys(chartDataToday).length === 0){
    chartDataToday = {'No data today': -1};
    createChart(canvas1, Object.keys(chartDataToday), Object.keys(chartDataToday).map(key => chartDataToday[key]), 'pie', {scaleBeginAtZero: true}, '#cc262d');
  } else {
    createChart(canvas1, Object.keys(chartDataToday), Object.keys(chartDataToday).map(key => chartDataToday[key]), 'pie', {scaleBeginAtZero: true})
  }
  if(Object.keys(chartDataWeekly).length === 0){
    chartDataWeekly = {'No data this week': -1};
    createChart(canvas2, Object.keys(chartDataWeekly), Object.keys(chartDataWeekly).map(key => chartDataWeekly[key]), 'doughnut', {scaleBeginAtZero: true}, '#cc262d');
  } else {
    createChart(canvas2, Object.keys(chartDataWeekly), Object.keys(chartDataWeekly).map(key => chartDataWeekly[key]), 'doughnut', {scaleBeginAtZero: true})
  }
  appendTotals(container1, todayData);
  appendTotals(container2, weeklyData);
  // createChart(canvas1, Object.keys(chartDataToday), Object.keys(chartDataToday).map(key => chartDataToday[key]), 'pie', {scaleBeginAtZero: true})
  // createChart(canvas2, Object.keys(chartDataWeekly), Object.keys(chartDataWeekly).map(key => chartDataWeekly[key]), 'doughnut', {scaleBeginAtZero: true})
};

async function buildGraphs() {

}


export { getLibcalEvents, buildEventCards, getReferenceData };
