import { gel } from '../utils.js';

function resize() {
  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  const isLandscape = wWidth > (wHeight - 100);
  grid(wWidth, wHeight, isLandscape);

}

function grid(wWidth, wHeight, isLandscape) {
  let left, top, width, height;
  if (isLandscape) {
    top = '60px'
    left = `${((wWidth - wHeight + 120) / 2)}px`;
    width = `${(wHeight - 120)}px`;
    height = width;
  } else {
    left = '10px'
    top = `${((wHeight - wWidth) / 2)}px`;
    width = `${(wWidth - 20)}px`;
    height = width;
  }
  const grid = gel('main-grid');
  grid.style.left = left;
  grid.style.top = top;
  grid.style.width = width;
  grid.style.height = height;
}

export {
  resize,
}
