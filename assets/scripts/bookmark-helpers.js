import { animateFlashBox } from './link-copy.js';

function bookmarkClickListener() {
  const bookmark = document.querySelector('#bookmark');
  if(bookmark){
    bookmark.addEventListener('click', async function(e) {
      console.log(e);
      this.classList.toggle('checked');
      const bookMarkData = gatherBookmarkData(this);
      const response = await postBookmark(bookMarkData);
      animateFlashBox(response.result);
    })
  }
}

function gatherBookmarkData(bookmark) {
  const id = bookmark.getAttribute('data-id');
  const type = bookmark.getAttribute('data-type');
  return {id, type};
}

async function postBookmark(data =  {}) {
  let response = await fetch('/bookmark', {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  });
  response = await response.json();
  return response;
}



export { bookmarkClickListener };
