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

function queryDeleteListener(closeBtn){
  closeBtn.addEventListener('click', function(e) {
    console.log(e.target.getAttribute('data-id'));
  })
}

function buildData(data, parentElement, labels, chartData, edit) {
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
  let ul = document.createElement('ul');
  ul.classList.add('list-group');
  ul.classList.add('reference-query');
  data.forEach((question) => {
    //build li container
    let li = document.createElement('li');
    li.classList.add('list-group-item');
    li.setAttribute('data-id', question._id);
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
    }
    if(edit == true){
      let closeSpan = document.createElement('span');
      closeSpan.classList.add('query-delete');
      closeSpan.classList.add('glyphicon');
      closeSpan.classList.add('glyphicon-remove');
      closeSpan.setAttribute('data-id', question._id);
      innerDiv.append(closeSpan);
      queryDeleteListener(closeSpan);
      // innerDiv.insertAdjacentHTML('beforeend', `<span data-id="${question._id}" class="query-delete glyphicon glyphicon-remove"></span>`)
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
  // let canvas = createCanvas('canvas', parentElement);
  // createChart(canvas, labels, chartData);
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


export{ initializeDatePickers, fetchApi, gatherData, buildData, queryDeleteListener }
