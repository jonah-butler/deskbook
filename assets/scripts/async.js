async function submitReference(btn) {
  // document.
  // querySelector('#submitReference').
  // addEventListener('click', async function() {
    btn.disabled = true;
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
      console.log(data);
      console.log(post);
      if(data.error){
        this.insertAdjacentHTML('afterend', '<h1>please login</h1>');
        post = {};
      } else {
        post = {};
        btn.disabled = false;
        confetti.start(2000);
        // modal.style.display = 'none';
      }
      // if(data){
      //   console.log(data);
      //   this.disabled = false;
      //   confetti.start(2000);
      // }
    }
  // })
}

export { submitReference };
