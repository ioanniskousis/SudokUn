function gel(id) {
  return document.getElementById(id);
}

function gelc(classname) {
  return document.getElementsByClassName(classname);
}

function crel(type) {
  return document.createElement(type);
}

function doc(container, element) {
  container.appendChild(element);
}

function opac(e) {
  e.style.display = 'flex';
  e.style.opacity = '1';
}

function trans(e) {
  e.style.opacity = '0';
  setTimeout(() => { e.style.display = 'none'; }, 600);
}

function hideView(backView) {
  trans(backView);
  setTimeout(() => { backView.remove(); }, 200);
}

function gat(element, attribute) {
  return element.getAttribute(attribute);
}

function sat(element, attribute, value) {
  element.setAttribute(attribute, value);
}

function swapCh(element) {
  const checked = gat(element, 'checked');
  element.setAttribute('checked', checked === '1' ? '0' : '1');
}

function isCh(element) {
  return gat(element, 'checked') === '1';
}

function setCh(element, check) {
  sat(element, 'checked', check ? '1' : '0');
}

function swapEx(element) {
  const excluded = gat(element, 'excluded');
  element.setAttribute('excluded', excluded === '1' ? '0' : '1');
}

function isEx(element) {
  return gat(element, 'excluded') === '1';
}

function setEx(element, excluded) {
  sat(element, 'excluded', excluded ? '1' : '0');
}

function optionValue(option) {
  return gat(option, "candidatenumber");
}

function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export {
  gel,
  gelc,
  crel,
  doc,
  opac,
  trans,
  gat,
  sat,
  swapCh,
  isCh,
  setCh,
  swapEx,
  isEx,
  setEx,
  optionValue,
  delay,
};
