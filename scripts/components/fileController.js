import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createControlButton, createFileInfo } from './controlButton.js';

function createFileController() {
  const panel = crel('div');
  panel.id = 'fileController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('numbersInputButton', 'grid-white.png'));
  doc(panel, createFileInfo('puzzleLevelLabel'));
  // doc(panel, createFileInfo('puzzleIndexLabel'));

  // doc(panel, createControlButton('candidatesSelectButton', 'edit-white.png'));
  // doc(panel, createControlButton('candidatesExcludeButton', 'delete-white.png'));

  return panel;
}

export default createFileController;