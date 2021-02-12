

async function fetchApi(url = '', data = {}) {
  submitAnimationInit(document.querySelector('.icon-circle'), 'clicked');
  let response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  });

  return await response.json();
}

function buildData(data, parentElement, labels, chartData) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('reference-query');
  data.forEach((question) => {
    //build li container
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    let innerDiv = document.createElement('div');
    innerDiv.classList.add('inner-flex');
    //build date and icon
    let date = new Date(question.createdAt);
    date = date.toLocaleString('en-US', options);
    innerDiv.insertAdjacentHTML('afterbegin', `<span><span class="glyphicon glyphicon-calendar"></span><span>${date}</span></span>`);
    //build branch and icon
    innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-home"></span><span class="library">${question.library}</span></span>`)
    li.appendChild(innerDiv);
    //build over 5 Minutes
    if(question.overFiveMinutes){
      innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-ok"></span><span class="time">Over 5 Minutes</span></span>`)
      li.appendChild(innerDiv);
    } else {
      innerDiv.insertAdjacentHTML('beforeend', `<span><span class="glyphicon glyphicon-remove"></span><span class="time">Not Over 5 Minutes</span></span>`)
      li.appendChild(innerDiv);
    }
    li.appendChild(innerDiv);
    //build description
    if(question.description){
      let descriptionDiv = document.createElement('div');
      descriptionDiv.classList.add('description-query');
      descriptionDiv.innerText = question.description;
      // li.insertAdjacentHTML('beforeend', `<div class="description-query">${question.description}</div>`);
      li.appendChild(descriptionDiv);
      li.style.borderLeft = '3px solid green';
      li.addEventListener('click', (e) => {
        descriptionDiv.classList.toggle('open');
      })
    } else {
      li.style.borderLeft = '3px solid red';
    }
    ul.appendChild(li);
  })
  parentElement.appendChild(ul);
  parentElement.insertAdjacentHTML('afterbegin', `<header class="jumbotron"><div class="container"><p>Query Total: ${data.length}</p></div></header>`);
  // parentElement.appendChild(document.createElement('canvas'));
  let canvas = createCanvas('canvas', parentElement);
  createChart(canvas, labels, chartData);
}

function createCanvas(className, parentElement) {
  let canvas = document.createElement('canvas');
  canvas.classList.add(className);
  parentElement.appendChild(canvas);
  return canvas;
}

function sortData(data) {
  return data.sort(function(a,b) {
    if(a.library.toUpperCase() < b.library.toUpperCase()){
      return -1;
    }
    if(a.library.toUpperCase() > b.library.toUpperCase()){
      return 1;
    }
    return 0;
  })
}

function setupDataForChart(response) {
  let valueObj = {};
  response.forEach((val, i, arr) => {
    if(valueObj[val.library] == undefined){
      valueObj[val.library] = 1;
    } else {
      valueObj[val.library] += 1;
    }
  })
  return valueObj;
}

function createChart(chartElement, labels, data) {
  var chart = new Chart(chartElement, {
    // The type of chart we want to create
    type: 'pie',

    // The data for our dataset
    data: {
        labels: labels,
        datasets: [{
            label: 'My First dataset',
            backgroundColor: ['#0267c1', '#0075c4', '#efa00b', '#d65108', '#591f0a', '#fcf300', '#2f1847', '#c62e65'],
            borderColor: '#fff',
            data: data,
        }]
    },

    // Configuration options go here
    options: {}
});
}

function submitAnimationInit(ele, newClass) {
  ele.classList.add(newClass);
  setTimeout(() => {
    ele.classList.remove(newClass);
  }, 500);
}

function gatherData(){
  const createdAt = [document.querySelector('#date-input-start').value, document.querySelector('#date-input-end').value];
  if(createdAt[0] == '' || createdAt[1] == ''){
    alert('please enter a valid start and end date');
    return false;
  }
  // const dateTo = document.querySelector('#date-input-end').value;
  const branch = document.querySelector('#branchDropdown').innerText;
  if(branch === "Branch "){
    alert('please enter a valid branch parameter or select all');
    return false;
  }
  // let overFiveMinutes;
  // if(document.querySelector('#questionLength:checked') == null){
  //   overFiveMinutes = false;
  // } else {
  //   overFiveMinutes = true;
  // }
  return {createdAt: createdAt, library: branch.toLowerCase()};
}

function initializeDatePickers(fromEle, toEle) {

  datepicker( fromEle,{
    formatter: (input, date, instance) => {
      const value = date.toLocaleDateString()
      input.value = value // => '1/1/2099'
    },
    position: 'tr',
  } );

  datepicker( toEle,{
    formatter: (input, date, instance) => {
      const value = date.toLocaleDateString()
      input.value = value // => '1/1/2099'
    },
    position: 'tr',
  } );
}

function clearResults(parentElement) {
  parentElement.innerHTML = '';
}

window.onload = function(){

  let branchBtn = document.querySelector('#branchDropdown');
  let branchMenu = document.querySelector('.dropdown-menu');

  branchMenu.addEventListener('click', (e) => {
    branchBtn.innerText = e.target.innerText;
    branchBtn.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
  })

  initializeDatePickers(document.querySelector('#date-input-start'), document.querySelector('#date-input-end'))

  document.querySelector('.icon-circle').addEventListener('click', async function(e){
    let data = gatherData();
    if(data != false){
      this.disabled = true;
      try {
        const response = await fetchApi(`https://${document.location.host}/reference/search`, data);
        console.log(response);
        if(!response.length){
          console.log('nothing');
          clearResults(document.querySelector('.view-container'));
          document.querySelector('.view-container').innerHTML = 'no data for this selected data range!';
          this.disabled = false;
          return;
        } else {
          clearResults(document.querySelector('.view-container'));
          let valueObj = setupDataForChart(response);
          buildData(response, document.querySelector('.view-container'), Object.keys(valueObj), Object.keys(valueObj).map(key => valueObj[key]));
          this.disabled = false;
          // sortData(response);
        }
      } catch(err) {
        console.log('fetch error', err);
      }
      // response.sort(function(a,b) {
      //   if(a.library.toUpperCase() < b.library.toUpperCase()){
      //     return -1;
      //   }
      //   if(a.library.toUpperCase() > b.library.toUpperCase()){
      //     return 1;
      //   }
      //   return 0;
      // })
      // let valueObj = {};
      // let counter = 0;
      // response.forEach((val, i, arr) => {
      //     if(val == arr[arr.length - 1]){
      //         if(val.library != arr[i-1].library){
      //             console.log(arr[i-1].library, counter);
      //             // valueArr.push({arr[i-1].library: counter});
      //             valueObj[arr[i-1].library] = counter;
      //             console.log(val.library, 1);
      //             valueObj[val.library] = counter;
      //         } else {
      //             // valueArr.push({arr[i-1].library: counter + 1]);
      //             valueObj[arr[i-1].library] = counter+1;
      //         }
      //     } else if(i != 0 && val.library != arr[i-1].library){
      //         console.log(arr[i-1].library, counter);
      //         valueObj[arr[i-1].library] = counter;
      //         // valueArr.push({arr[i-1].library: counter});
      //         counter = 0;
      //     }
      //     counter++;
      // })
      // console.log(valueObj);
      // this.disabled = false;
      // clearResults(document.querySelector('.view-container'));
      // buildData(response, document.querySelector('.view-container'), Object.keys(valueObj), Object.keys(valueObj).map(key => valueObj[key]));
    } else {
      return;
    }
  })

}
