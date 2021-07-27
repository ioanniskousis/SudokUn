import { createComponents } from './components/create.js';
import { resize } from './components/resize.js';

function createEvents() {
  window.addEventListener('resize', resize);

}

function render() {
  createComponents();
  createEvents()

  resize();
}


window.addEventListener('load', () => {
  render();
});

