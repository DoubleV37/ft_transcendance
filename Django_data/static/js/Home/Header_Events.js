function header_SetEvents () {
  let element = document.getElementById("HEADER_Logo");
  element.addEventListener("click", header_LogoCallback);

  element = document.getElementById("HEADER_IsAuth");
  const IsAuthenticated = element.getAttribute("data-auth");

  if (IsAuthenticated === "true") {
    element = document.getElementById("HEADER_NavSignOut");
    element.addEventListener("click", header_SignOutCallBack);

    element = document.getElementById("HEADER_NavProfile");
    element.addEventListener("click", header_ModProfilCallBack);

    element = document.getElementById("HEADER_user");
    element.addEventListener("click", header_ModProfilCallBack);
  } else if (IsAuthenticated === "false") {
    element = document.getElementById("HEADER_Signin");
    element.addEventListener("click", header_SignInCallBack);

    element = document.getElementById("HEADER_NavSignUp");
    element.addEventListener("click", header_SignUpCallBack);

    element = document.getElementById("HEADER_NavSignIn");
    element.addEventListener("click", header_SignInCallBack);
  } else {
    console.error(`header_SetEvents: error: ${element} unrecognised`);
  }
}

function header_DelEvents () {
  let element = document.getElementById("HEADER_Logo");
  element.removeEventListener("click", header_LogoCallback);

  element = document.getElementById("HEADER_IsAuth");
  const IsAuthenticated = element.getAttribute("data-auth");

  if (IsAuthenticated === "true") {
    element = document.getElementById("HEADER_user");
    element.removeEventListener("click", header_ModProfilCallBack);

    element = document.getElementById("HEADER_NavProfile");
    element.removeEventListener("click", header_ModProfilCallBack);

    element = document.getElementById("HEADER_NavSignOut");
    element.removeEventListener("click", header_SignOutCallBack);
  } else if (IsAuthenticated === "false") {
    element = document.getElementById("HEADER_Signin");
    element.removeEventListener("click", header_SignInCallBack);

    element = document.getElementById("HEADER_NavSignUp");
    element.addEventListener("click", header_SignUpCallBack);

    element = document.getElementById("HEADER_NavSignIn");
    element.addEventListener("click", header_SignInCallBack);
  } else {
    console.error(`header_DelEvents: error: ${element} unrecognised`);
  }
}

async function header_LogoCallback () {
  try {
    await loadPage(`${ROUTE.HOME}`);
    offcanvas_Hide();
  } catch (error) {
    console.log(`Error - header_L: ${error}`);
  }
}

function header_SignInCallBack () {
  try {
    loadPage(`${ROUTE.SIGNIN}`);
    offcanvas_Hide();
  } catch (error) {
    console.log(`Error - header_S: ${error}`);
  }
}

async function header_ModProfilCallBack () {
  try {
    offcanvas_Hide();
    await changeSection(`${ROUTE.PROFILE}`, "#ProfileModal");
    profileModal.modal.show();
  } catch (error) {
    console.log(`Error - header_M: ${error}`);
  }
}

function header_SignUpCallBack () {
  try {
    loadPage(`${ROUTE.SIGNUP}`);
    offcanvas_Hide();
  } catch (error) {
    console.log(`Error - header_SU: ${error}`);
  }
}

async function header_SignOutCallBack () {
  try {
    offcanvas_Hide();
    await MakeRequest(`${ROUTE.SIGNOUT}`);
    del_current_event(currentUrl);
    header_DelEvents();
    await changeSection(`${ROUTE.HEADER}`, "#Header_content");
    header_SetEvents();
    await loadPage(`${ROUTE.HOME}`);
  } catch (error) {
    console.log(`Error - header_SO: ${error}`);
  }
}
