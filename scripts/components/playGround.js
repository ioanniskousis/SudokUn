import {
  crel,
  doc,
} from '../utils/shortHands.js';
import createGrid from './grid.js';
// import createInputPanel from './inputPanel.js';
// import createCandidatesPanel from './candidatesPanel.js';
// import createExcludePanel from './excludePanel.js';
// import createSearchPanel from './searchPanel.js';
// import createBottomPanel from './bottomPanel.js';

function createPlayGround() {
  const playGround = crel('div');
  playGround.id = 'play-ground';

  doc(playGround, createGrid());
  // // doc(playGround, createCandidatesPanel());
  // doc(playGround, createExcludePanel());
  // doc(playGround, createSearchPanel());
  // doc(playGround, createBottomPanel());

  return playGround;
}

export default createPlayGround;
