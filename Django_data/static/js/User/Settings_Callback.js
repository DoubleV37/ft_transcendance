async function  settings_TwoFaCallBack() {
  console.log("the fuck ?");
  const form = document.getElementById('TWOFA_Form');
  const formData = new FormData(form);
  const	response = await MakeRequest(`${ROUTE.TWOFA_E}`, {
    method: 'POST',
    body: formData
  });
  if (response.status === 403 || response.status === 404) {
    return ;
  }
  const data = await response.json();

  if (data.status === 'continue') {
    await changeSection(`${ROUTE.TWOFA_Q}`, '#TwofaModal');
    await changeSection(`${ROUTE.TWOFA_C}`, '#confirm_2fa');
    TwofaModal['modal'].show();
  }
}

async function name_FormCallBack(event) {
  event.preventDefault();
  const	response = await nameSubmit();

  if (response === true) {
    header_DelEvents()
    await changeSection(`${ROUTE.HEADER}`, '#Header_content');
    header_SetEvents()
    await changeSection(`${ROUTE.SETTINGS}`, '#content');

  }
}

async function mail_FormCallBack(event) {
  event.preventDefault();
  const	response = await mailSubmit();

  if (response === true) {
    header_DelEvents()
    await changeSection(`${ROUTE.HEADER}`, '#Header_content');
    header_SetEvents()
    await changeSection(`${ROUTE.SETTINGS}`, '#content');
  }
}

async function pass_FormCallBack(event) {
  event.preventDefault();
  const	response = await passSubmit();

  if (response === true) {
    header_DelEvents()
    await changeSection(`${ROUTE.HEADER}`, '#Header_content');
    header_SetEvents()
    await loadPage(`${ROUTE.HOME}`);
  }
}

async function tname_FormCallBack(event) {
  event.preventDefault();
  const	response = await tnameSubmit();

  if (response === true) {
    header_DelEvents()
    await changeSection(`${ROUTE.HEADER}`, '#Header_content');
    header_SetEvents()
    await changeSection(`${ROUTE.SETTINGS}`, '#content');

  }
}

async function del_avatar_FormCallBack(event) {
  event.preventDefault();
  const	response = await del_avatarSubmit();

  if (response == true) {
    header_DelEvents()
    await changeSection(`${ROUTE.HEADER}`, '#Header_content');
    header_SetEvents()
    await changeSection(`${ROUTE.SETTINGS}`, '#content');

  }
}

function  settings_ModAvatarCallBack() {
  avatarModal['modal'].show();
}
