import { gel } from './utils/shortHands.js';
import Bounds from './utils/bounds.js';

function layoutCellCandidates(cellIndex, cellSize) {
  const candidateSize = (cellSize - 2) / 3.0;
  const locations = [0.0, candidateSize , candidateSize * 2.0];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const candidateIndex = (i * 3) + k + 1;
      const candidate = gel(`candidate-${cellIndex}-${candidateIndex}`);
      const bounds = new Bounds (
        locations[k] + 2,
        locations[i] + 2,
        candidateSize - 4,
        candidateSize - 4
      );
      bounds.bound(candidate);
      candidate.style.fontSize = `${parseInt(candidateSize * 0.6)}px`
    }
  }
}

function layoutBlockCells(blockIndex, blockSize) {
  const cellSize = parseInt((blockSize - 2.0) / 3.0, 10);
  const locations = [0.0, cellSize + 1.0, (cellSize + 1.0) * 2.0];
  const blockRow = parseInt(blockIndex / 3, 10);
  const blockCol = blockIndex % 3;
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const cellIndex = parseInt((((blockRow * 3) + i) * 9) + ((blockCol * 3) + k), 10);
      const cell = gel(`cell-${cellIndex}`);
      const candidatesContainer = gel(`cell-candidates-container-${cellIndex}`);
      const bounds = new Bounds (
        locations[k],
        locations[i],
        cellSize,
        cellSize
      );
      bounds.bound(cell);
      bounds.bound(candidatesContainer);
      cell.style.fontSize = `${parseInt(cellSize * 0.6)}px`

      layoutCellCandidates(cellIndex, cellSize);
    }
  }
}

function layoutBlocks(parentSize) {
  const blockSize = (parentSize - 6.0) / 3.0;
  const locations = [0.0, blockSize + 3.0, (blockSize + 3.0) * 2.0];
  for (let i = 0; i < 3; i++) {
    for (let k = 0; k < 3; k++) {
      const blockIndex = (i * 3) + k;
      const block = gel(`block-${blockIndex}`);
      const bounds = new Bounds (
        locations[k],
        locations[i],
        blockSize,
        blockSize
      );
      bounds.bound(block);
      layoutBlockCells(blockIndex, blockSize)

    }
  }
}

function layoutGrid(parentWidth, parentHeight, isLandscape) {
  let bounds = null;
  if (isLandscape) {
    const paddingSize = (parentWidth / 11.0);
    bounds = new Bounds (
      paddingSize,
      paddingSize,
      parentWidth * (9.0 / 11.0),
      parentWidth * (9.0 / 11.0)
    );
  } else {
    bounds = new Bounds (
      0.0,
      parentWidth / 4.5,
      parentWidth,
      parentWidth
    );
  }
  bounds.bound(gel('main-grid'));

  layoutBlocks(bounds.width);
}

function layoutPanels(parentWidth, parentHeight, isLandscape) {
  const gridSize = isLandscape ? parseInt(parentWidth * 9 / 11) : parentWidth;
  const blockSize = (gridSize - 6.0) / 3.0;
  
  const inputPanel = gel('inputPanel');
  const bounds = new Bounds();
  bounds.getRect(inputPanel);

  bounds.width = blockSize * 1.2;
  bounds.height = blockSize * 1.2;
  bounds.bound(inputPanel);

  const inputController = gel('inputController');
  const inputControllerButtons = inputController.children;

  const tipsController = gel('tipsController');
  const tipsControllerButtons = tipsController.children;

  if (isLandscape) {
    inputController.style.flexDirection = 'column';
    tipsController.style.flexDirection = 'column';

    const gridSize = parseInt(parentWidth * 9 / 11);
    const padding = parentWidth / 11;

    bounds.setRect (0, padding, padding, (gridSize - 6.0) / 3.0);
    bounds.bound(inputController);

    bounds.setRect (padding + gridSize, padding, padding, (gridSize - 6.0) / 3.0);
    bounds.bound(tipsController);

    for (let i = 0; i < inputControllerButtons.length; i++) {
      const button = inputControllerButtons[i];
      button.style.width = `${bounds.width * 0.8}px`;
      button.style.height = `${bounds.width * 0.8}px`;
      button.style.margin = `${bounds.width * 0.1}px`;
    }

    for (let i = 0; i < tipsControllerButtons.length; i++) {
      const button = tipsControllerButtons[i];
      button.style.width = `${bounds.width * 0.8}px`;
      button.style.height = `${bounds.width * 0.8}px`;
      button.style.margin = `${bounds.width * 0.1}px`;
    }
  } else {
    inputController.style.flexDirection = 'row';
    tipsController.style.flexDirection = 'row';

    const gridSize = parentWidth;
    const padding = parentHeight / 13;

    bounds.setRect(0, padding, (gridSize - 6.0) / 3.0, padding);
    bounds.bound(inputController);

    bounds.setRect(((gridSize + 3.0) * 6.0 / 9.0), padding, (gridSize - 6.0) / 3.0, padding);
    bounds.bound(tipsController);

    for (let i = 0; i < inputControllerButtons.length; i++) {
      const button = inputControllerButtons[i];
      button.style.width = `${bounds.height * 0.8}px`;
      button.style.height = `${bounds.height * 0.8}px`;
      button.style.margin = `${bounds.height * 0.1}px`;
    }

    for (let i = 0; i < tipsControllerButtons.length; i++) {
      const button = tipsControllerButtons[i];
      button.style.width = `${bounds.height * 0.8}px`;
      button.style.height = `${bounds.height * 0.8}px`;
      button.style.margin = `${bounds.height * 0.1}px`;
    }
  }
}

function layoutPlayGround(wWidth, wHeight, isLandscape) {
  let bounds = null;
  if (isLandscape) {
    bounds = new Bounds (
      (wWidth - wHeight) / 2.0,
      0.0,
      wHeight,
      wHeight
    );
  } else {
    if ((wHeight / wWidth) < (13.0 / 9.0)) {
      bounds = new Bounds (
        (wWidth - (wHeight * (9.0 / 13.0))) / 2.0,
        0.0,
        wHeight * (9.0 / 13.0),
        wHeight
      );
    } else {
      bounds = new Bounds (
        0.0,
        (wHeight - (wWidth * (13.0 / 9.0))) / 2.0,
        wWidth,
        wWidth * (13.0 / 9.0)
      );
    }
  }
  bounds.bound(gel('play-ground'));

  layoutGrid(bounds.width, bounds.height, isLandscape);
  layoutPanels(bounds.width, bounds.height, isLandscape)
}

function layout(gamePlay) {
  const wWidth = window.innerWidth;
  const wHeight = window.innerHeight;
  const isLandscape = wWidth > wHeight;
  layoutPlayGround(wWidth, wHeight, isLandscape);

  if (gamePlay.focusedCellIndex > -1) {
    gamePlay.focusCell(-1);
  }
  if (gamePlay.inputPanelVisible) {
    gamePlay.hideInputPanel();
  }
}

export {
  layout,
}
