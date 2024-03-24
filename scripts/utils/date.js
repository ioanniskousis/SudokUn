function nextYear(){
  var adate = new Date();
  var d = adate.getDate();
  var m = adate.getMonth();
  var y = adate.getFullYear() + 1;
  return new Date(y, m, d);
}

export {
  nextYear,
}