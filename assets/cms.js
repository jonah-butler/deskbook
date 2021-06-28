import {deleteFolder, imageThumbnailListener, newFolderListener, submitFolder, uploadImageListener, fileUploadListener} from './scripts/cms-helpers.js';

const thumbnails = document.querySelectorAll('.cms-thumbnail');
const sideMenu = document.querySelector('#sideMenu');
const sideMenuForm = document.querySelector('#sideMenuForm');
const backdrop = document.querySelector('.backdrop');
const sideMenuImg = document.querySelector('#sideMenuImg');
const downloadBtn = document.querySelector('#download');
const newFolderBtn = document.querySelector('#newFolder');
const submitFolderBtn = document.querySelector('#submitFolder');
const newFolderInput = document.querySelector('#folderName');
const urlInput = document.querySelector('#imageUrl');
const copyLink = document.querySelector('#copyLink');
const newImgBtn = document.querySelector('#uploadImage');
const sideMenuImgForm = document.querySelector('#sideMenuUpload');
const fileInput = document.querySelector('#imageUpload');
const deleteBtn = document.querySelector('#delete');
const submitImage = document.querySelector('#submitImage');
const deleteFolderBtn = document.querySelector('#deleteFolder');

imageThumbnailListener(thumbnails, sideMenu, backdrop, sideMenuImg, downloadBtn, urlInput, copyLink, deleteBtn);
newFolderListener(newFolderBtn, sideMenuForm, backdrop);
uploadImageListener(newImgBtn, sideMenuImgForm, backdrop);
submitFolder(submitFolderBtn, newFolderInput);
fileUploadListener(fileInput, submitImage);
if(deleteFolderBtn) {
  deleteFolder(deleteFolderBtn);
}
