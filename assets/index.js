import { modalClickListener } from './scripts/modal.js';
import { submitReference } from './scripts/async.js';
import { animatingStateInit } from './scripts/link-copy.js';

let modalBtnArr = new Array();
const referenceModalBtn = document.querySelector('.glyphicon-plus');
const linkCopy = document.querySelector('.show-link');

modalBtnArr.push(referenceModalBtn);

if(document.querySelector('#modalListener')){
  const landingModalBtn = document.querySelector('#modalListener');
  modalBtnArr.push(landingModalBtn);
}

if(linkCopy){
  animatingStateInit(linkCopy, document.querySelector('article'));
}

modalClickListener(modalBtnArr, submitReference);
