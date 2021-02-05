let input1 = document.querySelector('.tag-input-component');
let spanCont = document.querySelector('#spanContainer');
let stringArray = [];
let inputCounter = 1;

const inputListener = (domEle) => {
  domEle.addEventListener('keydown', event => {
    if(event.key === "Enter"){
      const newSpan = addSpan(spanCont, stringArray.join(""));
      addHiddenInput(newSpan, stringArray.join(""));
      stringArray = [];
      input1.value = '';
    } else if(event.key == 'Backspace') {
      stringArray.pop();
    } else {
      console.log(event);
      stringArray.push(event.key);
    }
  })
}

const closeListener = (ele) => {
  ele.addEventListener('click', (e) => {
    e.target.parentElement.remove();
  })
}

inputListener(input1);
Array
  .from(document.querySelectorAll('.category-close'))
  .forEach((close) => {
    closeListener(close);
  })

const addHiddenInput = (domEle, val) => {
  let renderedInput = createHiddenInput();
  renderedInput.value = val;
  renderHiddenInput(domEle, renderedInput);
  const close = createClose();
  closeListener(close);
  // renderClose(renderSpan, close);
}

const createHiddenInput = () => {
  const newInput = document.createElement('input');
  newInput.type = "hidden";
  newInput.name = `entry[category]`;
  inputCounter++;
  return newInput;
}

const renderHiddenInput = (domEle, input) => {
  // console.log(domEle, input);
  domEle.appendChild(input);
}

const addSpan = (domEle, val) => {
  let renderedSpan = createSpan();
  renderedSpan.textContent = val;
  renderSpan(domEle, renderedSpan);
  const close = createClose();
  closeListener(close);
  renderClose(renderedSpan, close);
  return renderedSpan;
}

const createSpan = () => {
  const newSpan = document.createElement('span');
  newSpan.classList.add('data-added');
  return newSpan;
}

const renderSpan = (domEle, newSpan) => {
  domEle.appendChild(newSpan);
}

const createClose = () => {
  const close = document.createElement('span');
  close.classList.add('category-close');
  close.textContent = 'x';
  return close;
}

const renderClose = (domEle, close) => {
  // domEle.insertAdjacentHTML('afterbegin', close);
  domEle.appendChild(close);
}

// const closeListener = (ele) => {
//   ele.addEventListener('click', (e) => {
//     e.target.parentElement.remove();
//   })
// }

// const addText = (val, ele) => {
//   let content = document.createTextNode(val);
//   return ele.appendChild(content);
// }

// addSpan(spanCont, 'test ');
