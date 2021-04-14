async function getLibcalEvents() {
  try{
    let response = await fetch("/calendarClient");
    response = await response.json();
    console.log(response);
    let tokenResponse = await fetch('https://rvalibrary.libcal.com/1.1/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: '570',
        client_secret: response.clientSecret,
        grant_type: 'client_credentials'
      }),
      headers: {
        'Content-type': 'application/json'
      }
    });
    tokenResponse = await tokenResponse.json();

    const events = await fetch(`https://rvalibrary.libcal.com/1.1/events?cal_id=14747&days=0`, {
      headers: {
        'Authorization': `Bearer ${tokenResponse.access_token}`
      }
    });
    const jsonEvents = await events.json();
    return jsonEvents;
  } catch(error){
    console.log(error);
  };
};

function buildEventCards(event, gradientName, gradient) {

  const date = new Date();

  let start = new Date(event.start);
  start = new Intl.DateTimeFormat('en-us', {timeStyle: 'short'}).format(start);

  let end = new Date(event.end);
  end = new Intl.DateTimeFormat('en-us', {timeStyle: 'short'}).format(end);

  return `
    <div class="event-panel fg1 ${gradientName}">
      ${gradient}
      <div class="event-panel-title">
        <h5>${event.title}</h5>
      </div>
      <div class="event-panel-date">
        ${date.toDateString()}
      </div>
      <div class="event-panel-time">
        ${start} - ${end}
      </div>
      <a target="blank" href="${event.url.public}" class="btn-chevron color-white absolute-bottom-right"><i class="fas fa-chevron-right"></i></a>
    </div>`;
};

export { getLibcalEvents, buildEventCards };
