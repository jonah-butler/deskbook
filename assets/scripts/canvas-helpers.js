function createCanvasAndAppend(className, parentElement) {
  let canvas = document.createElement('canvas');
  canvas.classList.add(className);
  parentElement.appendChild(canvas);
  return canvas;
}

export { createCanvasAndAppend }
