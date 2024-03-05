function  home_SetEvents() {
  let element = document.getElementById('PlayButton');

  element.addEventListener('click', PlayCallBack);
}

function  home_DelEvents() {
  let element = document.getElementById('PlayButton');

  element.removeEventListener('click', PlayCallBack);
}

function  PlayCallBack() {
  const	data = sessionStorage.getItem("ID");

  if (!data) {
    console.log("sessionStorage:ID -> empty");
  }
  else {
    console.log("sessionStorage:ID -> " + data);
  }
}
