//++++++++++++++++++++

// ASYNC GET REQUEST
async function getIt(url = '', computerNumber){
const response = await fetch(url);
let data = await response.json();
let filteredData = data.filter((obj) => {
  return obj.computerNum === computerNumber;
})
console.log(filteredData);
return filteredData;
}
// ASYNC POST REQUEST
async function postData(url = '', data = {}){
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json'
    }
  });

  return await response.json();
}
// EVENT LISTENER FOR POST/GET ASYNC FUNCS
// testBtn.addEventListener("click", function(){
//   postData('/test-api', {name: 'Mike'});
//   getIt().then(x => {
//     let a = document.querySelector('.result-container');
//     x.forEach((obj)=>{
//       a.innerText += `${obj.computerNum} -- `;
//     })
//   });
// });
//+++++++++++++++++++++++

let addBtn = document.querySelectorAll('.add');
let minusBtn = document.querySelectorAll('.minus');
let printTotal = document.querySelectorAll('.print-total');
let compNumField = document.querySelectorAll('.number-field');
let testBtn = document.querySelector('.test');
let resultArea = document.querySelector('.result-container');
let remainingPrints = document.querySelectorAll('.remaining-prints');
let deleteUserBtn = document.querySelectorAll('.delete-user');
let submitPrintsBtn = document.querySelectorAll('.submit-prints');
let checkMark = document.querySelectorAll('.check-mark');
let card = document.querySelectorAll('.card');


function addPrint(x){
  let compNum = parseInt(compNumField[x].innerText);
  let printNum = parseInt(printTotal[x].innerText);
  let remainingNum = parseInt(remainingPrints[x].innerText);
  if(printNum < 10){
    printNum++;
    remainingNum--;
    remainingPrints[x].innerText = remainingNum;
    printTotal[x].innerText = printNum;
  } else {
    printTotal[x].innerText = 10;
  }
}

function removePrint(x){
  let compNum = parseInt(compNumField[x].innerText);
  let printNum = parseInt(printTotal[x].innerText);
  let remainingNum = parseInt(remainingPrints[x].innerText);
  if(printNum > 0){
    printNum--;
    remainingNum++;
    remainingPrints[x].innerText = remainingNum;
    printTotal[x].innerText = printNum;

  } else {
    printTotal[x].innerText = 0;
  }
}

function submitPrint(x){
  let compNum = parseInt(compNumField[x].innerText);
  let printNum = parseInt(printTotal[x].innerText);
  let cardId = card[x].getAttribute('data-id');
  checkMark[x].classList.add('show');
  setTimeout( () => {
    checkMark[x].classList.remove('show');
  }, 4000);
  postData('/user/print-tracker-update', {computerNum: compNum, numOfPrints: printNum, id: cardId});

}

function disableBtn(x){
  submitPrintsBtn[x].disabled = true;
  setTimeout( () => {
    submitPrintsBtn[x].disabled = false;
  }, 3000);
}



for(let i = 0; i < addBtn.length; i++){
  addBtn[i].addEventListener('click', function(){
    addPrint(i);
  })
}

for(let i = 0; i < minusBtn.length; i++){
  minusBtn[i].addEventListener('click', function(){
    removePrint(i);
  })
}


for(let i = 0; i < submitPrintsBtn.length; i++){
  submitPrintsBtn[i].addEventListener('click', function(){
      submitPrint(i);
      disableBtn(i);
  })
}



// let categorySelect = document.querySelector('select');
// let costField = document.querySelector('.cost-field');
// let costValue = document.querySelector('#costField').value;
// const cabinetField = document.querySelector('.cabinet-field');
// const titleField = document.querySelector('#titleField');


// if(costValue == "" || costValue == undefined){
//   costField.style.display = "none";
//   categorySelect.addEventListener('input', (e) => {
//     let target = event.target.value;
//     if(target === 'Purchasable Goods'){
//       costField.style.display = "block";
//     }
//   })
// }
//
// if(cabinetField){
//   cabinetField.style.display = "none";
//   categorySelect.addEventListener('input', (e) => {
//     let target = event.target.value;
//     if(target === 'Where In The Drawer'){
//       cabinetField.style.display = "block";
//     }
//   })
// }




// getIt().then(x => {
//   let a = document.querySelector('.result-container');
//   x.forEach((obj)=>{
//     a.innerText += `${obj.computerNum} --`;
//   })
// });


// const data = {name: 'Jonah'};
//
// const options = {
//   method: 'POST',
//   body: JSON.stringify(data),
//   headers: {
//     'Content-type': 'application/json'
//   },
// };


//++++++++++++++++++++

// ASYNC GET REQUEST
// async function getIt(){
// const response = await fetch('/test-api');
// let data = await response.json();
// console.log(data);
// return data;
// }
// ASYNC POST REQUEST
// async function postData(url = '', data = {}){
//   const response = await fetch(url, {
//     method: 'POST',
//     body: JSON.stringify(data),
//     headers: {
//       'Content-type': 'application/json'
//     }
//   });
//   console.log(response.json());
//   return await response.json();
// }
// EVENT LISTENER FOR POST/GET ASYNC FUNCS
// testBtn.addEventListener("click", function(){
//   postData('/test-api', {name: 'Mike'});
//   getIt().then(x => {
//     let a = document.querySelector('.result-container');
//     x.forEach((obj)=>{
//       a.innerText += `${obj.computerNum} -- `;
//     })
//   });
// });
//+++++++++++++++++++++++




// let test = document.querySelector('button.test');
// test.addEventListener('click', () => {
// 	let data = getIt().then(data => {
// 	let a = document.querySelector('.result-container');
//
// })
// })

// };
