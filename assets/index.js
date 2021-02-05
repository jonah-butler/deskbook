import { modalClickListener } from './scripts/modal.js';
import { submitReference } from './scripts/async.js';

const referenceModalBtn = document.querySelector('.glyphicon-plus');

modalClickListener(referenceModalBtn, submitReference);
