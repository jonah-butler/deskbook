import { animateFlashBox } from './link-copy.js';
import { sortDataAZ, sortDataZA, setupDataForChart, sortDataTimeAsc, sortDataTimeDesc } from './client-helpers.js';
import { clearResults } from './dom-helpers.js';
import { createCanvasAndAppend } from './canvas-helpers.js';
import { createChart } from './chart-helpers.js';

let _referenceQueries;
let _viewContainer;
let _numOfItems = 15;
let _filteredQueries = null;
let _currentFilter = [];

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

function buildFilterSection(parentElement, key, value) {
  parentElement.insertAdjacentHTML('afterbegin', `<div class="filter-array"></div>`);
  buildFilterTagAndAppend();
}

function buildFilterTagAndAppend() {
  _currentFilter.forEach(filter => {
    let span = document.createElement('span');
    span.classList.add('filter-added');
    span.innerText = filter;
    document.querySelector('.filter-array').appendChild(span);
  })
}

function buildUl() {
  let ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('reference-query');
  return ul;
}

function navigatePagination(num, e, parent) {
  document.querySelector('.reference-query').remove();
  Array.from(parent.children).
  forEach(child => {
    if(child.classList.contains('active')){
      child.classList.remove('active');
    }
  })
  e.target.parentElement.classList.add('active');
  let offsetData;
  let queryArr;
  if(_filteredQueries) {
    queryArr = _filteredQueries;
  } else {
      queryArr = _referenceQueries;
  }

  if(num === 1){
    offsetData = queryArr.slice(0, _numOfItems);
  } else {
    offsetData = queryArr.slice((_numOfItems * (num - 1)), (_numOfItems * (num - 1) + _numOfItems))
  }
  renderData(offsetData, _viewContainer, false);
}

function buildPagination(data, parentElement, selectedTab = 1) {
  const ul = document.createElement('ul');
  ul.classList.add('pagination');

  const numOfPages = Math.ceil(data.length / _numOfItems);
  const maxTabs = 4
  const currentTab = selectedTab;

  for(let i = 1; i < numOfPages+1; i++){
  // for(let i = 1; i <= maxTabs; i++){
    if(i <= numOfPages){
      const li = document.createElement('li');
      li.classList.add('page-item');
      if(i === 1){
        li.classList.add('active');
        let activeEle = li;
      }
      const a = document.createElement('a');
      a.classList.add('page-link');
      a.innerText = i;
      // if(i === maxTabs && numOfPages > currentTab){
      //   a.innerText = i + '...';
      // } else {
      //   a.innerText = i;
      // }
      li.appendChild(a);
      a.addEventListener('click', (e) => {
        navigatePagination(i, e, ul);
      });
      ul.appendChild(li);
    }
  }
  parentElement.appendChild(ul);
}

function buildLi(data, edit, arr) {
  const options = { year: 'numeric', month: 'short', day: 'numeric' };
  let li = document.createElement('li');
  li.classList.add('list-group-item');
  li.setAttribute('data-id', data._id);

  let innerDiv = document.createElement('div');
  innerDiv.classList.add('inner-flex');

  let date = new Date(data.createdAt);
  let time = new Date(data.createdAt);
  date = date.toLocaleString('en-US', options);
  time = time.toLocaleString('en-US', {timeStyle: 'short'});
  innerDiv.insertAdjacentHTML('afterbegin', `<span><span class="glyphicon glyphicon-calendar"></span><span>${date}</span></span>`);
  innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-time"></span><span>${time}</span></span>`);
  if(data.subLocation){
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-home"></span><span class="library">${data.library} - ${data.subLocation}</span></span>`);
  } else {
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-home"></span><span class="library">${data.library}</span></span>`)
  }
  li.appendChild(innerDiv);

  if(data.overFiveMinutes){
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-ok"></span><span class="time">Over 5 Minutes</span></span>`)
    li.appendChild(innerDiv);
  } else {
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-remove"></span><span class="time">Over 5 Minutes</span></span>`)
    li.appendChild(innerDiv);
  }
  innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-question-sign"></span><span class="time">${data.refType}</span></span>`);
  innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-info-sign"></span><span class="time">${data.answeredHow}</span></span>`);
  innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-user"></span><span class="time">${data.user.username}</span></span>`);
  li.appendChild(innerDiv);

  if(edit == true){
    let closeDiv = document.createElement('div');
    closeDiv.classList.add('query-delete');
    closeDiv.classList.add('glyphicon');
    closeDiv.classList.add('glyphicon-remove');
    closeDiv.setAttribute('data-id', data._id);
    innerDiv.append(closeDiv);
    queryDeleteListener(closeDiv, document.querySelector('.query-total'), arr);
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

function buildData(data, parentElement, edit, currentPage) {
  buildHeader(data, parentElement);
  buildPagination(data, parentElement);
  renderData(currentPage, parentElement, edit);
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

    let p = document.createElement('p');
    let span = document.createElement('span');

    p.classList.add('location-totals');
    p.setAttribute('data-key', key);
    p.innerText = `${key}: `;
    p.addEventListener('click', (e) => {
      if(e.target.classList.contains('location-totals')) {
        filterByBranchKey(e.target.getAttribute('data-key'));
      }
    });

    span.classList.add('location-totals-amount');
    span.innerText = `${sortedObj[key]}`;

    p.appendChild(span);
    header.appendChild(p);
    // header.insertAdjacentHTML('beforeend', `<p class="location-totals" data-key="${key.split(' ')[key.split(' ').length - 1]}" style="font-size: 14px; font-weight: 600;">${key}: <span style="color: red;">${sortedObj[key]}<span></p>`);
  })
}

function filterByBranchKey(key) {
  if(key.split(' ').indexOf('main') !== -1) {
    const subLocation = key.split(' ')[1];
    console.log('hit', subLocation);
    if(_filteredQueries) {
      _filteredQueries = _filteredQueries.filter(query => {
        return query.subLocation === subLocation;
      })
    } else {
      _filteredQueries = _referenceQueries.filter(query => {
        return query.subLocation === subLocation;
      })
    }
  } else {
    console.log('hit, not main', key);
    if(_filteredQueries) {
      _filteredQueries = _filteredQueries.filter(query => {
        return query.library === key;
      })
    } else {
      _filteredQueries = _referenceQueries.filter(query => {
        return query.library === key;
      })
    }
  }
  if(_currentFilter.indexOf(key)){
    _currentFilter.push(key);
  }
  fullRender(_viewContainer, _filteredQueries, false, true, _filteredQueries, key);
  buildFilterSection(document.querySelector('.totals-container'));
}

function printTotals(header, queryObj, key, value){
  const filteredArr = queryObj.filter(ref => {
    return ref[key] === value;
  });
  queryObj = filteredArr;
  // console.log(queryObj.length);
  // console.log(queryObj);
  const para = document.createElement('p');
  const span = document.createElement('span');
  if(filteredArr.length) {
    para.classList.add('link-filter');
    para.setAttribute('data-key', key);
    para.setAttribute('data-value', value);
    para.innerText = `${key}(${value}): `;
    span.innerText = filteredArr.length;
    para.appendChild(span);
    para.addEventListener('click', function() {
      filterListener(queryObj, para);
    });
    header.appendChild(para);
    // header.insertAdjacentHTML('beforeend', `<p onclick="filterListener()" class="link-filter" data-key="${key}" data-value="${value}" style="font-size: 12px;">${key}(${value}): <span style="color: red;">${filteredArr.length}<span></p>`)
  } else {
    header.insertAdjacentHTML('beforeend', `<p style="font-size: 12px;">${key}(${value}): <span style="color: red;">${filteredArr.length}<span></p>`)
  }
}

function filterListener(query, para) {
  const key = para.getAttribute('data-key');
  const value = para.getAttribute('data-value');
  _filteredQueries = query.filter(ref => {
    return ref[key].toString() == value;
  })
  if(_currentFilter.indexOf(`${key}: ${value}`) == -1) {
    _currentFilter.push(`${key}: ${value}`);
  }
  fullRender(_viewContainer, _filteredQueries, false, true, _filteredQueries, key);
  buildFilterSection(document.querySelector('.totals-container'));
}

function clearFilter(container){
  const para = document.createElement('p');
  para.innerText = 'Remove Date Filter';
  para.classList.add('link-filter');
  para.addEventListener('click', function(){
    _filteredQueries = null;
    _currentFilter = [];
    fullRender(_viewContainer, _referenceQueries, false, true);
  })
  container.appendChild(para);
}

function fullRender(parentContainer, response, edit, sort, sortedList = null, sortedListKey = null) {
  console.log(response);
  if(!sortedList){
    _referenceQueries = response;
  }
  _viewContainer = parentContainer;
  clearResults(parentContainer);
  let chartDataObj;
  if(sortedList){
    let currentPage = sortedList.slice(0, _numOfItems);
    // clearResults(parentContainer);
    chartDataObj = setupDataForChart(sortedList);
    buildData(sortedList, _viewContainer, edit, currentPage);
    printBranchTotals(document.querySelector('.totals-container'), chartDataObj);
    printTotals(document.querySelector('.totals-container'), sortedList, 'answeredHow', 'phone');
    printTotals(document.querySelector('.totals-container'), sortedList, 'answeredHow', 'online');
    printTotals(document.querySelector('.totals-container'), sortedList, 'answeredHow', 'person');
    printTotals(document.querySelector('.totals-container'), sortedList, 'overFiveMinutes', true);
    printTotals(document.querySelector('.totals-container'), sortedList, 'overFiveMinutes', false);
    printTotals(document.querySelector('.totals-container'), sortedList, 'refType', 'reference');
    printTotals(document.querySelector('.totals-container'), sortedList, 'refType', 'directional');
    printTotals(document.querySelector('.totals-container'), sortedList, 'refType', 'circulation');
    // printTotals(document.querySelector('.totals-container'), sortedList, sortedListKey, sortedList[0][sortedListKey]);
    clearFilter(document.querySelector('.totals-container'));
  } else {
    // _referenceQueries = response;
    let currentPage = _referenceQueries.slice(0, _numOfItems);
    // clearResults(parentContainer);
    chartDataObj = setupDataForChart(_referenceQueries);
    console.log(chartDataObj);
    buildData(_referenceQueries, _viewContainer, edit, currentPage);
    printBranchTotals(document.querySelector('.totals-container'), chartDataObj);
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'phone');
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'online');
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'person');
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'overFiveMinutes', true);
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'overFiveMinutes', false);
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'reference');
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'directional');
    printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'circulation');
  }
  // _referenceQueries = response;
  // _viewContainer = parentContainer;
  // let currentPage = _referenceQueries.slice(0, _numOfItems);
  // clearResults(parentContainer);
  // let chartDataObj = setupDataForChart(_referenceQueries);
  // buildData(_referenceQueries, _viewContainer, edit, currentPage);
  let canvas = createCanvasAndAppend('canvas', document.querySelector('.chart-container'));
  // printBranchTotals(document.querySelector('.totals-container'), chartDataObj);
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'phone');
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'online');
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'answeredHow', 'person');
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'overFiveMinutes', true);
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'overFiveMinutes', false);
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'reference');
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'directional');
  // printTotals(document.querySelector('.totals-container'), _referenceQueries, 'refType', 'circulation');

  if(sort){
    if(_filteredQueries) {
      sortDropDown(document.querySelector('.totals-container'), _filteredQueries, _viewContainer, false);
    } else {
      sortDropDown(document.querySelector('.totals-container'), _referenceQueries, _viewContainer, false);
    }
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
  const sort3 = document.createElement('li');
  const sort4 = document.createElement('li');
  sort1.innerText = "A - Z";
  sort1.addEventListener('click', () => {
    fullRender(parentContainer, sortDataAZ(data), edit, true, _filteredQueries);
  })
  sort2.innerText = "Z - A";
  sort2.addEventListener('click', () => {
    fullRender(parentContainer, sortDataZA(data), edit, true, _filteredQueries);
  })
  sort3.innerText = "Time <";
  sort3.addEventListener('click', () => {
    fullRender(parentContainer, sortDataTimeAsc(data), edit, true, _filteredQueries);
  })
  sort4.innerText = "Time >";
  sort4.addEventListener('click', () => {
    fullRender(parentContainer, sortDataTimeDesc(data), edit, true, _filteredQueries);
  })
  menu.append(sort1);
  menu.append(sort2);
  menu.append(sort3);
  menu.append(sort4);
  dropDown.append(menu);
  parentElement.append(dropDown);
}


export{ fullRender, initializeDatePickers, fetchApi, gatherData, buildData, queryDeleteListener, printBranchTotals, sortDropDown }
