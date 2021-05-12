import { closeModal, resetModalForms } from './modal.js';
import { animateFlashBox } from './link-copy.js';

async function submitReference(btn) {
    btn.disabled = true;
    let isRefCorrect = false;
    let isTypeCorrect = false;

    const modal = document.querySelector('#Modal');
    const library = document.querySelector('#branchLocation').value;
    const overFiveMinutes = document.querySelector('#questionLength').checked;
    const description = document.querySelector('#referenceDescription').value;
    const subLocation = document.querySelector('#mainSubLocation').value;
    let refType;
    let answeredHow;
    if(!document.querySelector('input[name="question[refType]"]:checked')){
    } else {
      refType = document.querySelector('input[name="question[refType]"]:checked').value;
      isRefCorrect = true;
    }
    if(!document.querySelector('input[name="question[answeredHow]"]:checked')){
    } else {
      answeredHow = document.querySelector('input[name="question[answeredHow]"]:checked').value;
      isTypeCorrect = true;
    }

    if(library === "main" && subLocation === ""){
      isTypeCorrect = false;
    }

    if(library != "" && isRefCorrect && isTypeCorrect){
      let post;
      if(subLocation === ''){
        post = {library, overFiveMinutes, refType, answeredHow};
      } else {
        post = {library, overFiveMinutes, subLocation, refType, answeredHow};
      }

      if(description != ''){
        post.description = description;
      }

      const response = await fetch(`${document.location.protocol}//${document.location.host}/reference`, {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if(data.error){
        animateFlashBox('Please Login to add reference queries');
        post = {};
      } else {
        resetModalForms(modal);
        closeModal(modal);
        animateFlashBox('Question submitted successfully!');
        post = {};
        btn.disabled = false;
      }
    } else {
      alert('please select the correct fields');
      btn.disabled = false;
    }
}

export { submitReference };
