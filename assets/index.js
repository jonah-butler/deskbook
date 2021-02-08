import { modalClickListener } from './scripts/modal.js';
import { submitReference } from './scripts/async.js';

let modalBtnArr = new Array();
const referenceModalBtn = document.querySelector('.glyphicon-plus');
modalBtnArr.push(referenceModalBtn);
if(document.querySelector('#modalListener')){
  const landingModalBtn = document.querySelector('#modalListener');
  modalBtnArr.push(landingModalBtn);
}

modalClickListener(modalBtnArr, submitReference);
