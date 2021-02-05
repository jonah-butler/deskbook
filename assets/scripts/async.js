async function submitReference() {
  document.
  querySelector('#submitReference').
  addEventListener('click', async function() {
    const library = document.querySelector('select').value;
    const overFiveMinutes = document.querySelector('#questionLength').checked;
    const description = document.querySelector('#referenceDescription').value;
    const post = {library, overFiveMinutes, description};
    if(library != ""){
      const response = await fetch('http://localhost:3000/reference', {
        method: 'POST',
        body: JSON.stringify(post),
        headers: {
          'Content-type': 'application/json',
        },
      });
      const data = await response.json();
      if(data){
        console.log(data);
        confetti.start(2000);
      }
    }
  })
}

export { submitReference };
