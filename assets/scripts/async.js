import { closeModal, resetModalForms } from './modal.js';
import { animateFlashBox } from './link-copy.js';

async function submitReference(btn) {
    btn.disabled = true;

    const modal = document.querySelector('#Modal');
    const library = document.querySelector('select').value;
    const overFiveMinutes = document.querySelector('#questionLength').checked;
    const description = document.querySelector('#referenceDescription').value;

    let post = {library, overFiveMinutes, description};

    if(library != ""){
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
        confetti.start(2000);
      }
    }
}

export { submitReference };
