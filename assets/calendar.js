import {formatDatesForDatePickers} from './helpers/helpers-client.js';


const dates = {

  dayNames: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],

  monthNames: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],

  getDayName(dateString){
    const dayInt = dateString.getDay();
    return this.dayNames[dayInt];
  },

  getMonthName(dateString){
    const monthInt = dateString.getMonth();
    return this.monthNames[monthInt];
  },

  getTime(dateString){
    let hour = dateString.getHours();
    if(hour > 12){
        hour = hour - 12;
        hour += 'pm';
    } else if(hour == 12) {
        hour += 'pm';
    } else {
        hour += 'am';
    }
    return hour;
  }

}

let date1 = new Date("2020-04-15T10:30:00-04:00");



const calendarModule = {

  calendarIds: {
    'Belmont': 7752,
    'Broad Rock': 7340,
    'East End': 7753,
    'Ginter Park': 7750,
    'Hull Street': 7405,
    'Main': 7469,
    'North Avenue': 7402,
    'West End': 7751,
    'Westover Hills': 7403,
    'Virtual': 14747,
  },

  inputFields: {
    from: document.querySelector('#date-input-start'),
    to: document.querySelector('#date-input-end'),
    submit: document.querySelector('.icon-circle'),
    today: document.querySelector('#today'),
  },

  initializeDatePickers(){

    datepicker( this.inputFields.from,{
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value // => '1/1/2099'
      },
      position: 'tr',
    } );

    datepicker( this.inputFields.to,{
      formatter: (input, date, instance) => {
        const value = date.toLocaleDateString()
        input.value = value // => '1/1/2099'
      },
      position: 'tr',
    } );
  },

  findDateDiff(date1, date2){
    let d1 = new Date(date1);
    let d2 = new Date(date2);

    let timeDiff = d2.getTime() - d1.getTime();

    return timeDiff / (1000 * 3600 * 24);
  },

   addSubmitListener(ele){
    ele.addEventListener('click', () => {
      this.submitAnimationInit(ele, 'clicked');
      const d1 = this.inputFields.from.value;
      const d2 = this.inputFields.to.value;
      const timeDiff = this.findDateDiff(d1, d2);
      if(timeDiff < 0){
        alert('enter valid date range');
        return;
      }
      const urlFirstDate = new Date(d1).toISOString().split('T')[0];
      let id = this.getBranchId();
      try{
        this.clearView();
        this.getAndFetch(urlFirstDate, timeDiff, id);
      } catch(e){
        console.log(e);
      }
    })
  },

  dropdownSelection(){
    let branchBtn = document.querySelector('#branchDropdown');
    let branchMenu = document.querySelector('.dropdown-menu');

    branchMenu.addEventListener('click', (e) => {
      branchBtn.innerText = e.target.innerText;
      branchBtn.insertAdjacentHTML('beforeend', '<span class="caret"></span>');
    })
  },

  getBranchId(){
    let branchName = document.querySelector('#branchDropdown').innerText;
    let branchKeys = Object.keys(this.calendarIds);
    if(branchKeys.indexOf(branchName) != -1){
      return this.calendarIds[branchName];
    } else {
      alert('Don\'t forget to select a branch');
    }
  },

  submitAnimationInit(ele, newClass){
    ele.classList.add(newClass);
    setTimeout(() => {
      ele.classList.remove(newClass);
    }, 500);
  },

  async getAndFetch(firstDate, timeDiff, id){
      try{
        let response = await this.getClient("/calendarClient");
          let secondRespond = await this.fetchApi(response.clientSecret, firstDate, timeDiff, id);
      } catch(e){
        console.log(e);
      }

  },

  async getClient(url = ''){
    const response = await fetch(url);
    let data = await response.json();
    return data;
  },

  async fetchApi(secret, firstDate, timeDiff, id){
    let response = await fetch('https://rvalibrary.libcal.com/1.1/oauth/token', {
      method: 'POST',
      body: JSON.stringify({
        client_id: '570',
        client_secret: secret,
        grant_type: 'client_credentials'
      }),
      headers: {
        'Content-type': 'application/json'
      }
    });
    let data = await response.json();
      await fetch(`https://rvalibrary.libcal.com/1.1/events?cal_id=${id}&date=${firstDate}&days=${timeDiff}`, {
        headers: {
          'Authorization': `Bearer ${data.access_token}`
        }
      }).then((finalResp) => {
        return finalResp.json();
      }).then((data) => {
        let view = document.querySelector('.view-container');
        if(data.events.length) {
          data.events.forEach((event) => {
            let eventObj = {};
            let start;
            let end;
            eventObj.title = event.title;
            eventObj.description = event.description.replace(/(<([^>]+)>)/ig,"");
            if(event.location.name == ""){
              eventObj.location = event.calendar.name;
            } else {
              eventObj.location = event.location.name;
            }
            start = new Date(event.start);
            end = new Date(event.end);
            eventObj.start = dates.getTime(start);
            eventObj.end = dates.getTime(end);
            eventObj.day = dates.getDayName(start);
            eventObj.month = dates.getMonthName(start);
            eventObj.month = eventObj.month.slice(0, 3);
            eventObj.date = start.getDate();
            eventObj.url = event.url.public;
            view.insertAdjacentHTML('beforeend', this.buildHTML(eventObj));
          })
          view.insertAdjacentHTML('afterbegin', `<button id="print" style="font-size: 25px;" class="button-main-sm glyphicon glyphicon-print"></button`);
          document.querySelector('#print').addEventListener('click', function() {
            const printWin = window.open('','new div','height=600,width=800');
            // printWin.document.write(`${view.innerHTML}`);
            printWin.document.write('<html><head><title></title>');
            printWin.document.write('<link rel="stylesheet" href="./print.css" type="text/css" />');
            printWin.document.write('</head><body >');
            printWin.document.write(view.innerHTML);
            printWin.document.write('</body></html>');
            printWin.document.close();
            printWin.focus();
            setTimeout(function(){
              printWin.print();
              // printWin.close();
            },1000);
          });
        } else {
          view.insertAdjacentHTML('beforeend', `<h1>No data for that selected date range!</h1><img class="empty-events-img" src="imgs/undraw_calendar_dutt.svg" alt="">`);
        }
      })
    },

    clearView(){
      let view = document.querySelector('.view-container');
      Array.from(view.childNodes).forEach((node) => {
        view.removeChild(node);
      })
    },

    buildHTML(obj){
      const html = `<div class="calendar-card-container">
  <div class="calendar-card">
    <div class="card-content">
      <div class="card-header">
        <div class="calendar-box">
          <div class="day">${obj.date}</div>
          <div class="month">${obj.month}</div>
        </div>
        <div class="card-text-aside">
          <div class="day-name">${obj.day}</div>
          <div class="time">${obj.start} - ${obj.end}</div>
          <div class="location">${obj.location}</div>
        </div>
        <div class="calendar-right">
          <i class="far fa-calendar-alt"></i>
        </div>
      </div>
      <div class="calendar-body">
        <a style="text-decoration: none; color: #ff7236; font-size: 22px;" href="${obj.url}"><div class="title">${obj.title}</div></a>
        <div class="description">${obj.description}</div>
      </div>
  </div>
  </div>
</div>`
return html;
},

  buildHTML2(obj){
    const html = `<div class="bs-example">
    </div>
    <figure></figure>`
return html;
},

  todayBtnListener() {
    this.inputFields.today.addEventListener('click', () => {
      this.inputFields.from.value = formatDatesForDatePickers(new Date());
      this.inputFields.to.value = formatDatesForDatePickers(new Date());
      this.inputFields.submit.click();
    })
  },

  init(){
    this.initializeDatePickers();
    this.dropdownSelection();
    this.addSubmitListener(this.inputFields.submit);
    this.inputFields.submit.click();
    this.todayBtnListener();
  }
}

calendarModule.init();
