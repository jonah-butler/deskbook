import { animateFlashBox } from './link-copy.js';
import  { sortDataAZ, sortDataZA, setupDataForChart } from './client-helpers.js';
import { clearResults } from './dom-helpers.js';
import { createCanvasAndAppend } from './canvas-helpers.js';
import { createChart } from './chart-helpers.js';

let _referenceQueries;
let _viewContainer;

async function fetchApi(url = '', data = {}) {
  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  });

  return await response.json();
}

async function queryDeleteListener(closeBtn, queryBox, arr){
  closeBtn.addEventListener('click', async function(e) {
    const data = {id: e.target.getAttribute('data-id')};
    if(confirm('Are you sure you want to delete this entry?')){
      try{
        const response = await fetchApi(`${document.location.protocol}//${document.location.host}/user/reference`, data);
        if(response.success){
          animateFlashBox('reference question deleted successfully');
          arr.forEach((query, i, arr) => {
            if(query._id == data.id){
              arr.splice(i, 1);
              console.log(arr);
              return;
            }
          })
          fullRender(_viewContainer, arr, true, false);
        }
      } catch(err) {
        animateFlashBox('an error occurred in deleting');
      }
    }
  })
}

function buildHeader(data, parentElement) {
  parentElement.insertAdjacentHTML('afterbegin', `<header class="jumbotron"><div class="container"><div class="row"><div class="totals-container col-sm-4"><h3 style="display:inline-block;">Query Total: </h3><h2 style="display: inline-block; padding-left: 5px;" class="query-total">${data.length}</h2></div><div class="chart-container col-sm-8"></div></div></div></header>`);
}

function buildUl() {
  let ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('reference-query');
  return ul;
}

function buildLi(data, edit, arr) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let li = document.createElement('li');
  li.classList.add('list-group-item');
  li.setAttribute('data-id', data._id);

  let innerDiv = document.createElement('div');
  innerDiv.classList.add('inner-flex');

  let date = new Date(data.createdAt);
  date = date.toLocaleString('en-US', options);

  innerDiv.insertAdjacentHTML('afterbegin', `<span><span class="glyphicon glyphicon-calendar"></span><span>${date}</span></span>`);
  innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-home"></span><span class="library">${data.library}</span></span>`)
  li.appendChild(innerDiv);

  if(data.overFiveMinutes){
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-ok"></span><span class="time">Over 5 Minutes</span></span>`)
    li.appendChild(innerDiv);
  }

  if(edit == true){
    let closeSpan = document.createElement('span');
    closeSpan.classList.add('query-delete');
    closeSpan.classList.add('glyphicon');
    closeSpan.classList.add('glyphicon-remove');
    closeSpan.setAttribute('data-id', data._id);
    innerDiv.append(closeSpan);
    queryDeleteListener(closeSpan, document.querySelector('.query-total'), arr);
  }

  li.appendChild(innerDiv);

  if(data.description){
    let descriptionDiv = document.createElement('div');
    descriptionDiv.classList.add('description-query');
    descriptionDiv.innerText = data.description;
    li.appendChild(descriptionDiv);
    li.style.borderLeft = '3px solid green';
    li.addEventListener('click', (e) => {
      descriptionDiv.classList.toggle('open');
    })
  } else {
    li.style.borderLeft = '3px solid red';
  }
  return li;
}

function renderData(data, parentElement, edit) {
  const ul = buildUl();
  data.forEach((question, i, arr) => {
    let li = buildLi(question, edit, arr);
    ul.appendChild(li);
  })
  parentElement.appendChild(ul);
}

function buildData(data, parentElement, edit) {
  buildHeader(data, parentElement);
  renderData(data, parentElement, edit);
}

function gatherData(){
  const createdAt = [document.querySelector('#date-input-start').value, document.querySelector('#date-input-end').value];

  if(createdAt[0] == '' || createdAt[1] == ''){
    alert('please enter a valid start and end date');
    return false;
  }

  if(document.querySelector('#branchDropdown')){
    const branch = document.querySelector('#branchDropdown').innerText;

    if(branch === "Branch "){
      alert('please enter a valid branch parameter or select all');
      return false;
    }

    return {createdAt: createdAt, library: branch.toLowerCase()};

  } else {
    return {createdAt: createdAt};
  }
}

function initializeDatePickers(fromEle, toEle) {
  if(fromEle && toEle){
    datepicker( fromEle,{
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value
      },
      position: 'tr',
    } );

    datepicker( toEle,{
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value
      },
      position: 'tr',
    } );
  }
}

function printBranchTotals(header, sortedObj) {
  Object.keys(sortedObj).forEach(key => {
    header.insertAdjacentHTML('beforeend', `<p style="font-size: 12px;">${key}: <span style="color: red;">${sortedObj[key]}<span></p>`);
  })
}

function fullRender(parentContainer, response, edit, sort) {
  _referenceQueries = response;
  _viewContainer = parentContainer;
  clearResults(parentContainer);
  let chartDataObj = setupDataForChart(_referenceQueries);
  buildData(_referenceQueries, _viewContainer, edit);
  let canvas = createCanvasAndAppend('canvas', document.querySelector('.chart-container'));
  printBranchTotals(document.querySelector('.totals-container'), chartDataObj);
  if(sort){
    sortDropDown(document.querySelector('.totals-container'), _referenceQueries, _viewContainer, false);
  }
  createChart(canvas, Object.keys(chartDataObj), Object.keys(chartDataObj).map(key => chartDataObj[key]), 'pie');
}

function sortDropDown(parentElement, data, parentContainer, edit) {
  const dropDown = document.createElement('div');
  dropDown.classList.add('dropdown');
  dropDown.insertAdjacentHTML('afterbegin', `<button class="btn btn-default dropdown-toggle" type="button" id="sortDropDown" data-toggle="dropdown" aria-haspopup="true" aria-expanded="true">
    Sort Data
  <span class="caret"></span>
  </button>`);
  const menu = document.createElement('ul');
  menu.classList.add('dropdown-menu');
  menu.setAttribute('aria-labelledby', 'sortDropDown');
  // const menu = `<ul class="dropdown-menu" aria-labelledby="sortDropDown"></ul>`;
  const sort1 = document.createElement('li');
  const sort2 = document.createElement('li');
  sort1.innerText = "A - Z";
  sort1.addEventListener('click', () => {
    fullRender(parentContainer, sortDataAZ(data), edit, true);
  })
  sort2.innerText = "Z - A";
  sort2.addEventListener('click', () => {
    fullRender(parentContainer, sortDataZA(data), edit, true);
  })
  menu.append(sort1);
  menu.append(sort2);
  dropDown.append(menu);
  parentElement.append(dropDown);
}


export{ fullRender, initializeDatePickers, fetchApi, gatherData, buildData, queryDeleteListener, printBranchTotals, sortDropDown }
