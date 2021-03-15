import Categorical from './scripts/categorical.js';
import { animateFlashBox } from './scripts/link-copy.js';

async function getHash(){
  let response = await fetch(`${document.location.protocol}//${document.location.host}/get-signature`);
  response = await response.json();
  // response.region = 's3-us-east-1';
    console.log(response);
  initializeFroala(response);
}

async function sendImgDataForDelete(data = {}){
  let response = await fetch(`${document.location.protocol}//${document.location.host}/delete-img`, {
    method: 'POST',
    body: JSON.stringify(data),
    headers: {
      'Content-type': 'application/json',
    },
  })
  response = await response.json();
  if(response.statusCode === 200){
    animateFlashBox('Image deleted from S3 server.');
  } else {
    animateFlashBox('Error deleting your image from the S3 server');
  }
}

async function initializeFroala(hashedData) {
  new FroalaEditor('textarea', {
    theme: 'dark',
    imageAllowedTypes: ['jpeg', 'jpg', 'png'],
    imageUploadToS3: hashedData,
    imageUploadUrl: false,
    events: {
      'image.uploadedToS3': (link, key, response) => {
        console.log(response);
        console.log('link', link);
        console.log('key', key);
      },
      'image.removed': (img) => {
        console.log(img);
        const s3Src = img[0].getAttribute('src');
        sendImgDataForDelete({s3Src});
      }
    },
    toolbarButtons: ['fullscreen', 'bold', 'italic', 'underline', 'strikeThrough', 'insertImage', '|',
      'fontFamily', 'fontSize', 'color', 'inlineStyle', 'paragraphStyle', 'textColor', 'backgroundColor', '|', 'paragraphFormat', 'align',
      'formatOL', 'formatUL', 'outdent', 'indent', 'quote', '-', 'insertLink', 'insertTable', '|',
      'emoticons', 'specialCharacters', 'insertHR', 'selectAll', 'clearFormatting', '|']
  });
}

Categorical.categorical.init(document.querySelector('.tag-input-component'), document.querySelector('#spanContainer'), 'entry[category]');

getHash();
