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

export {
  gel,
  gelc,
  crel,
  doc,
  opac,
  trans,
  gat,
  sat,
};
