import { createComponents } from './components/create.js';
import { layout } from './components/layout.js';

function createEvents() {
  window.addEventListener('resize', layout);

}

function render() {
  createComponents();
  createEvents()

  layout();
}


window.addEventListener('load', () => {
  render();
});

