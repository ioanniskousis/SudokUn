import {
  gel,
  crel,
  doc,
} from '../utils/shortHands.js';
import { createControlButton, createFileInfo } from './controlElements.js';

function createFileController() {
  const panel = crel('div');
  panel.id = 'fileController';
  panel.className = 'buttons-panel';

  doc(panel, createControlButton('fileSelectorButton', 'grid-white'));
  doc(panel, createFileInfo('puzzleLevelLabel'));
  doc(panel, createFileInfo('puzzleIndexLabel'));

  // doc(panel, createControlButton('candidatesSelectButton', 'edit-white'));
  // doc(panel, createControlButton('candidatesExcludeButton', 'delete-white'));

  return panel;
}

export default createFileController;
