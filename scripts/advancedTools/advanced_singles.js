import { showCanvas } from '../viewController.js';

function singleTip() {
  showCanvas();
}

function nakedSingleClicked(element) {
  clearDrawDivision();

  var nakedSingle = findNakedSingle();
  if (nakedSingle == null) {
      reportNotFoundTools( "'.$no_nakedSingle[$ses_lang].'", element);
  } else {
    inpCovClicked(nakedSingle.firstCell);
    explaneNakedSingle(nakedSingle);
    drawNakedSingle(nakedSingle);
  }
}
function drawNakedSingle(nakedSingle) {
    var rect = nakedSingle.option.getBoundingClientRect();

    var drawDivision = _el("drawDivision");
    var drect = drawDivision.getBoundingClientRect();

    var ctx = drawDivision.getContext("2d");
    ctx.translate(0, 0);
    ctx.lineWidth   = "0.5";
    ctx.strokeStyle = "red";
    ctx.strokeRect(rect.left - drect.left - 0.5, rect.top - drect.top - 0.5, rect.width, rect.height);

  ctx.lineWidth   = "0.5";
  joinParagraphWithElement(ctx, drect, _el("thiscell"), nakedSingle.firstCell, "#004c66");

}
function findNakedSingle() {

  for (var ci = 0; ci < 81; ci++) {
    var cell = _el("cell" + ci.toString());
    var checkedCount = 0;
    var singleOption = 0;
    for (var opt = 1; opt < 10; opt++) {
      var option = _el("option" + ci.toString() + "-" + opt.toString());
      if (optionIsExcludable(option)) {
        singleOption = option;
        checkedCount++;
      }
    }
    if (checkedCount == 1) {
      return {firstCell:cell, option:singleOption};
    }
  }
   
  return null;
}

function hiddenSingleClicked(element) {
  clearDrawDivision();

  var hiddenSingle = findHiddenSingle();
  if (hiddenSingle == null) {
    reportNotFoundTools( "'.$no_hiddenSingle[$ses_lang].'", element);
  } else {
    inpCovClicked(hiddenSingle.firstCell);

    explaneHiddenSingle(hiddenSingle);
    drawHiddenSingle(hiddenSingle);
  }
}
function drawHiddenSingle(hiddenSingle) {
    var rect = hiddenSingle.option.getBoundingClientRect();

    var drawDivision = _el("drawDivision");
    var drect = drawDivision.getBoundingClientRect();

    var ctx = drawDivision.getContext("2d");
    ctx.translate(0, 0);
    ctx.lineWidth   = "1.5";
    ctx.strokeStyle = "red";

  if (hiddenSingle.group == "row") {
    shadeRow(ctx, drect, parseInt(_gAttEl(hiddenSingle.firstCell, "row")));
  } else if (hiddenSingle.group == "column") {
    shadeColumn(ctx, drect, parseInt(_gAttEl(hiddenSingle.firstCell, "column")));
  } else {
    shadeBlock(ctx, drect, parseInt(_gAttEl(hiddenSingle.firstCell, "block")));
  }
  ctx.lineWidth   = "0.5";
  joinParagraphWithElement(ctx, drect, _el("thiscell"), hiddenSingle.firstCell, "#004c66");

      var rad = (rect.height / 2);
      var cX = rect.left - drect.left - 0.5 + rad;
      var cY = rect.top - drect.top - 0.5 + rad;
      ctx.beginPath();
      ctx.ellipse(cX, cY, rad, rad, 0, 0, 2 * Math.PI);
      ctx.stroke();
}
function findHiddenSingle() {

  for (var ci = 0; ci < 81; ci++) {
    var cell = _el("cell" + ci.toString());
    for (var opt = 1; opt < 10; opt++) {
      var optionD = _el("option" + ci.toString() + "-" + opt.toString());
      if (_isChEl(optionD)) {
        if (_gAttEl(optionD, "excluded") == "0") {
          var hiddenSingle = cellHasUnicOptionInNeighborhood(cell, opt);
          if (hiddenSingle) {
            return hiddenSingle;
          }
        }
      }
   
    }
  }
   
  return null;
}
function cellHasUnicOptionInNeighborhood(destCell, opt) { 
  var block  = _gAttEl(destCell, "block");
  var row    = _gAttEl(destCell, "row");
  var column = _gAttEl(destCell, "column");
  var xIndex = _gAttEl(destCell, "cellIndex");
  var hiddenSingle = null;
  var optionD = _el("option" + xIndex.toString() + "-" + opt.toString());

  var optionIsUnicInBlock  = 1;
  var optionIsUnicInRow    = 1;
  var optionIsUnicInColumn = 1;
  for (var i = 0; i < 81; i++) {
    if (i != xIndex) {
      var cell = _el("cell" + i.toString());
      if (cell.value.length == 0) {
        var option = _el("option" + i.toString() + "-" + opt.toString());
        if (_gAttEl(cell, "block") == block) {
          if (_isChEl(option)) {
            if (_gAttEl(option, "excluded") == "0") {
              optionIsUnicInBlock = 0;
            }
          }
        }
        if (_gAttEl(cell, "row") == row) {
          if (_isChEl(option)) {
            if (_gAttEl(option, "excluded") == "0") {
              optionIsUnicInRow = 0;
            }
          }
        }
        if (_gAttEl(cell, "column") == column) {
          if (_isChEl(option)) {
            if (_gAttEl(option, "excluded") == "0") {
              optionIsUnicInColumn = 0;
            }
          }
        }
      }
    }
  }
  if ( optionIsUnicInBlock == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"block"}
  } else if ( optionIsUnicInRow == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"row"}
  } else if ( optionIsUnicInColumn == 1) {
    hiddenSingle = {firstCell:destCell, option:optionD, group:"column"}
  }
  return hiddenSingle;
}

export {
  singleTip,
}
