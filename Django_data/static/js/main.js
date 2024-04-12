// ----------Run at the load/reload of the website-------------//
document.addEventListener("DOMContentLoaded", launchWebsite);

async function launchWebsite () {
  const targetNode = document.querySelector("#content");

  if (!targetNode) {
    console.error("InitMainPage Error: TargetNode not found");
    return;
  }

  const config = { childList: true, subtree: true };

  await changeSection(`${ROUTE.HEADER}`, "#Header_content");
  header_SetEvents();

  modal_ProfileInit();
  modal_2FaCodeInit();
  modal_2FaInit();
  modal_AvatarInit();


  observer = new MutationObserver(mutationCallBack);
  observer.observe(targetNode, config);
  main_SetFirstsEvents();

  document.removeEventListener("DOMContentLoaded", launchWebsite);
}

function main_SetFirstsEvents () {
  const element = document.getElementById("titleContent");

  console.log("aled ??");
  if (!element) {
    console.log("Fuck it...");
    return;
  }
  launchSectionHandler(element);
}
// -----------------------------------------------------------//

function mutationCallBack (mutationsList) {
  for (const mutation of mutationsList) {
    if (mutation.type === "childList") {
      const element = document.getElementById("titleContent");

      if (!element) {
        continue;
      }
	  console.log("Come on please, don't detect me 2 child !");
      launchSectionHandler(element);
    }
  }
}

function launchSectionHandler (element) {
	console.log("euh ??");
  const elementAttribut = element.getAttribute("data-content");

  try {
    switch (elementAttribut) {
    case "HOME_PAGE":
      home_SetEvents();
      break;
    case "SIGNIN_PAGE":
      signin_SetEvents();
      break;
    case "SIGNUP_PAGE":
      signup_SetEvents();
      break;
    case "SETTINGS":
      settings_SetEvents();
      break;
    case "GAME_MODES":
      modes_SetEvents();
      break;
    case "GAME_PARAMETERS":
      parameters_SetEvents();
      break;
	case 'GAME_SOLO':
		observer.disconnect();
	  game_SetEvents();
	  break ;
    default:
      throw new Error(
        `launchSectionHandler: Attribute ${elementAttribut} non recognised`
      );
    }
  } catch (err) {
    console.error("Error: ", err);
  }
}
