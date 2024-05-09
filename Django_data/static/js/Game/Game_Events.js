function game_SetEvents () {
	if (window.location.pathname === "/game/solo/")
		gameSocket = new WebSocket("wss://" + window.location.host + "/wss" + window.location.pathname);
	else
		gameSocket = new WebSocket("wss://" + window.location.host + "/ws/multi" + window.location.pathname);
	gameSocket.addEventListener("message", SetTheGame);
	gameSocket.addEventListener("open", OnOpenCallback);
	gameSocket.addEventListener("close", OnCloseCallback);
	init_canvas();
}

function game_DelEvents () {
  console.log("game_DelEvents");
  document.removeEventListener("keyup", keyUp);
  document.removeEventListener("keydown", keyDown);
  if (loading === true) {
	gameSocket.removeEventListener("message", SetTheGame);
  } else {
	gameSocket.removeEventListener("message", receive_data);
  }
  if (gameCanvas.inGame == true) {
	gameCanvas.inGame = false;
	gameSocket.send(JSON.stringify({ message: "stop" }));
	gameSocket.send(JSON.stringify({ message: "stopGame" }));
	wait_and_close();
  } else {
	gameSocket.close();
  }

  keyStates = {
	ArrowUp: false,
	ArrowDown: false,
	w: false,
	s: false,
	space: false
  };
}

async function wait_and_close () {
  sleep(1000);
  gameSocket.close(1000);
}

function SetTheGame (event) {
  const data = JSON.parse(event.data);

  loading = true;
  gameCanvas.inGame = true;
  if (data.message === "Game stopped") {
	if (deleteEvent === true) {
	  return;
	}
	gameSocket.removeEventListener("message", SetTheGame);
	EndGame("Game already finished!");
  } else {
	if (deleteEvent === true) {
	  return;
	}
	parseUserInfos(data);
	setGameScreen();
	gameSocket.removeEventListener("message", SetTheGame);
	gameSocket.addEventListener("message", receive_data);
	document.addEventListener("keyup", keyUp);
	document.addEventListener("keydown", keyDown);
	update();
  }
  loading = false;
}

function OnOpenCallback () {
  gameStop = false;
  console.log("The connection was setup successfully !");
  gameSocket.addEventListener("message", SetTheGame);
  gameCanvas.powerup = GameParams.powerup;
  gameSocket.send(JSON.stringify(GameParams));
}

function OnCloseCallback () {
  gameSocket.removeEventListener("message", receive_data);
  gameSocket.removeEventListener("open", OnOpenCallback);
  gameSocket.removeEventListener("close", OnCloseCallback);

  console.log("Socket was closed!");
  gameStop = true;
}

function keyUp (e) {
  keyStates[e.key] = false;
}

function keyDown (e) {
  if (e.key !== "F5" && !(e.key === "F5" && e.ctrlKey) && e.key !== "F12") {
	e.preventDefault();
  }
  keyStates[e.key] = true;
}

function init_canvas () {
  gameCanvas.canvas = document.getElementById("MyCanvas");
  gameCanvas.ctx = gameCanvas.canvas.getContext("2d");
  gameCanvas.style = getComputedStyle(gameCanvas.canvas);
  gameCanvas.width = parseInt(gameCanvas.style.getPropertyValue("width"), 10);
  gameCanvas.height = parseInt(gameCanvas.style.getPropertyValue("height"), 10);
  gameCanvas.canvas.width = gameCanvas.width;
  gameCanvas.canvas.height = gameCanvas.height;
  gameCanvas.paddle1Height = 0,
  gameCanvas.paddle2Height = 0,
  gameCanvas.powerup = false,
  gameCanvas.powerupY = 0,
  gameCanvas.powerupX = 0,
  gameCanvas.powerupsize = 0,
  gameCanvas.ballRadius = 0,
  gameCanvas.opponent = "",
  gameCanvas.num = 0,
  gameCanvas.inGame = true;
}
