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
      candidate.style.fontSize = `${candidateSize * 0.6}px`
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
      cell.style.fontSize = `${cellSize * 0.6}px`

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
  if (isLandscape) {
    const gridSize = parseInt(parentWidth * 9 / 11);
    const padding = parentWidth / 11;
    const bounds = new Bounds(
      padding,
      0,
      gridSize,
      padding
    );
    bounds.bound(gel('inputPanel'));

    bounds.top = padding + gridSize;
    bounds.bound(gel('bottomPanel'));

    bounds.setRect(0, padding, padding, gridSize)
    bounds.bound(gel('searchPanel'));

    bounds.left = padding + gridSize;
    bounds.bound(gel('excludesPanel'));
  } else {
    const gridSize = parentWidth;
    const padding = parentHeight / 13;
    const bounds = new Bounds(
      0,
      0,
      gridSize,
      padding
    );
    bounds.bound(gel('searchPanel'));

    bounds.top = padding;
    bounds.bound(gel('inputPanel'));

    bounds.top = padding + padding + gridSize;
    bounds.bound(gel('bottomPanel'));

    bounds.top = padding + padding + padding + gridSize;
    bounds.bound(gel('excludesPanel'));
    
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
}

export {
  layout,
}
