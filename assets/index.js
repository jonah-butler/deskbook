import { modalClickListener } from './scripts/modal.js';
import { submitReference } from './scripts/async.js';
import { animatingStateInit, linkCopy } from './scripts/link-copy.js';

let modalBtnArr = new Array();
const referenceModalBtn = document.querySelector('.glyphicon-plus');
const linkCopyBtn = document.querySelector('.show-link');

modalBtnArr.push(referenceModalBtn);

if(document.querySelector('#modalListener')){
  const landingModalBtn = document.querySelector('#modalListener');
  modalBtnArr.push(landingModalBtn);
}

if(linkCopyBtn){
  animatingStateInit(linkCopyBtn, document.querySelector('article'), 'link copied!');
}

Array.
from(modalBtnArr).
forEach((node) => {
  node.addEventListener('click', function(e) {
    modalClickListener(submitReference);
  })
})

document.
querySelector('#submitReference').
addEventListener('click', function(e) {
  submitReference(this);
})
