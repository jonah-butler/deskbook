import {animatingStateInit, animateFlashBox} from './link-copy.js';

let copyEventHandler;

function imageThumbnailListener(nodes, sideMenu, backdrop, sideMenuImg, downloadBtn, urlInput, copyLink, deleteBtn) {
  sideMenuCloseListener(document.querySelector('#sideMenuClose'), sideMenu, backdrop, copyLink);
  downloadClickListener(downloadBtn, sideMenuImg);
  deleteClickListner(deleteBtn, sideMenuImg);
  Array.from(nodes).forEach(node => {
    node.addEventListener('click', (e) => {
      expandSideMenu(sideMenu, copyLink);
      triggerBackdrop(backdrop);
      populateSideMenuImg(selectImageSrc(e), selectImageKey(e));
      populateImgName(selectImageSrc(e), urlInput, copyLink);
    })
  })
}

function linkCopyListener(btn) {
  let input = document.querySelector('#imageUrl').value;
  copyEventHandler = animatingStateInit(btn, 'aws link copied', input);
}

function deleteClickListner(btn, sideMenuImg) {
  btn.addEventListener('click', async (e) => {
    const key = selectImageKey(sideMenuImg);
    console.log(key);
    let resp = await fetch(`${window.location.origin}/media/delete`, {
      method: 'POST',
      body: JSON.stringify({
        key: key,
      }),
      headers: {
        'Content-type': 'application/json',
      },
    })
    const data = await resp.json();
    location.reload();
  })
}

function removeLinkCopyListener(btn) {
  if(btn) {
    btn.removeEventListener('click', copyEventHandler);
  }
}

function submitFolder(btn, input) {
  btn.addEventListener('click', async (e) => {
    if(validateInput(input)){
      const validation = prompt(`Confirm new folder named: ${input.value}?
Type true if yes.`);
      if(validation){
        const prefix = gatherUrlPrefix();
        console.log(prefix);
        let test = await fetch(`${window.location.origin}/media/new-folder`, {
          method: 'POST',
          body: JSON.stringify({
            folder: input.value,
            prefix: prefix.directories,
          }),
          headers: {
            'Content-type': 'application/json',
          },
        });
        const data = await test.json();
        if(data.successful) {
          location.reload();
        }
      }
    } else {
      console.log('not looking good');
    }
  })
}

function validateInput(input) {
  if(!input.value){
    console.log('please fill in the folder name before submitting');
    return false;
  }
  return true;
}

function gatherUrlPrefix() {
  const prefix = {}
  let url = new URLSearchParams(window.location.search);
  if(!url.has('prefix')){
    prefix.directories = ['public'];
    return prefix;
  } else {
    const entries = url.entries();
    prefix.directories = [];
    for(let entry of entries) {
      prefix.directories.push(entry[1]);
    }
    return prefix;
  }
}

function newFolderListener(btn, sideMenu, backdrop) {
  sideMenuCloseListener(document.querySelector('#sideMenuClose2'), sideMenu, backdrop);
  btn.addEventListener('click', (e) => {
    triggerBackdrop(backdrop);
    expandSideMenu(sideMenu);
  })
}

function uploadImageListener(btn, sideMenu, backdrop) {
  sideMenuCloseListener(document.querySelector('#sideMenuClose3'), sideMenu, backdrop);
  btn.addEventListener('click', (e) => {
    triggerBackdrop(backdrop);
    expandSideMenu(sideMenu);
  })
}

function expandSideMenu(sideMenu) {
  sideMenu.classList.toggle('expand');
}

function triggerBackdrop(backdrop) {
  backdrop.classList.toggle('show');
  backdrop.style.top = `${window.scrollY}px`;
  document.body.classList.toggle('no-scroll');
}

function sideMenuCloseListener(closeBtn, sideMenu, backdrop, copyBtn){
  closeBtn.addEventListener('click', (e) => {
    console.log(sideMenu);
    expandSideMenu(sideMenu);
    triggerBackdrop(backdrop);
    removeLinkCopyListener(copyBtn);
  })
}

function selectImageSrc(e){
  if(e.target.getAttribute('data-type') === 'file') {
    return {
      src: e.target.getAttribute('data-src'),
      fileName: e.target.getAttribute('data-file'),
    }
  } else {
    return e.target.src;
  }
}

function selectImageKey(e) {
  if(!e.target){
    return e.getAttribute('data-key');
  } else {
    return e.target.getAttribute('data-key');
  }
}

function populateSideMenuImg(src, key) {
  if(typeof(src) != 'object') {
    sideMenuImg.setAttribute('src', src);
    sideMenuImg.setAttribute('data-key', key);
  } else {
    sideMenuImg.setAttribute('src', '/imgs/file_icon.png');
    sideMenuImg.setAttribute('data-key', key);
  }
}

function populateImgName(src, urlInput, copyBtn) {
  if(typeof(src) !== 'object') {
    urlInput.value = src;
  } else {
    urlInput.value = src.src;
  }
  linkCopyListener(copyBtn);
}

async function downloadImgBlob(button, key) {
  let response = await fetch(`${window.location.origin}/media/signed-url`, {
    method: 'POST',
    body: JSON.stringify({key: key}),
    headers: {
      'Content-type': 'application/json',
    },
  });
  const data = await response.json();
  let awsResponse = await fetch(data.signedUrl, {mode: 'cors'});
  const blob = await awsResponse.blob();
  const imageURL = URL.createObjectURL(blob);
  triggerDownload(button, key, imageURL);
}

function triggerDownload(button, key, url) {
  const link = document.createElement('a');
  link.classList.add('invisible');
  link.href = url;
  link.download = key;
  link.click();
  URL.revokeObjectURL(url);
}

function downloadClickListener(button, sideMenuImg) {
  button.addEventListener('click', async (e) => {
    const url = await downloadImgBlob(button, sideMenuImg.getAttribute('data-key'));
  })
}

function packageFormData(e, key) {
  console.log(key);
  const data = new FormData();
  const amendedFile = renameFile(e.target.files[0], key);
  data.append('name', key);
  data.append('upload', amendedFile);
  return data;
}

async function sendUpload(formData) {
  let response = await fetch(`${window.location.origin}/media/upload`, {
    method: 'POST',
    body: formData,
  });
  const data = await response.json();
  if(data.success) {
    location.reload();
  }
}

function buildUploadKey(arr, fileName) {
  const location = arr.directories.join('/');
  let fileKey = `deskbook-uploads/${location}/${fileName}`;
  return fileKey;
}

function renameFile(originalFile, newName) {
  Object.defineProperty(originalFile, 'name', {
    writable: true,
    value: newName,
  })
  return originalFile;
}

function fileUploadListener(fileInput) {
  fileInput.addEventListener('change', (e) => {
    if(isFileMimeTypeValid(e.target.files[0].type)) {
      e.target.classList.toggle('approved');
      const key = buildUploadKey(gatherUrlPrefix(), e.target.value.split('\\')[e.target.value.split('\\').length - 1]);
      const file = packageFormData(e, key);
      sendUpload(file);
    } else {
      animateFlashBox('sorry that file type is not supported yet!');
      e.target.value = '';
    }
  })
}

function isFileMimeTypeValid(fileType) {
  const validImgTypes = ['image/gif', 'image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
  console.log(fileType);
  if(!validImgTypes.includes(fileType)){
    return false;
  } else {
    return true;
  }
}

export {imageThumbnailListener, fileUploadListener, newFolderListener, submitFolder, uploadImageListener};
