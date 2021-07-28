import { nextYear } from './date.js';

function setData(key, value) {
  document.cookie = `${key}=${value}; expires=${nextYear().toUTCString()}`;
}

function getData(key) {
  let name = key + "=";
  let decodedCookie = decodeURIComponent(document.cookie);
  let ca = decodedCookie.split(';');
  for(let i = 0; i <ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }
  return null;
}

function removeData(key) {
  document.cookie = `${key}=;`;
}

export {
  setData,
  getData,
  removeData,
}
