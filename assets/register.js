
  let usernameFields = document.querySelectorAll('.username-button');


  for(let i = 0; i < usernameFields.length; i++){
    usernameFields[i].addEventListener("click", function(event){
      let user = event.target.innerText;
      displayUser(user);
    })
  }

  async function displayUser(userInfo) {
    try{
      await getUser('/register-show-user', {username: userInfo} )
        .then((data) => {
          data = data[0]
          let userContainer = document.querySelector('.user-edit-section');
          let h3 = document.createElement('h3');
          h3.innerHTML = `Editing Profile for user: ${data.username}`;
          userContainer.appendChild(h3);
        })
    } catch (e){
      console.log(e);
    } finally {
      console.log('reached the finally');
    }
  }

  async function getUser(url = '', userinfo = {}){
    const response = await fetch(url, {
      method: 'POST',
      body: JSON.stringify(userinfo),
      headers: {
        'Content-type': 'application/json'
      }
    });
    let data = await response.json();
    return data;
    // let filteredData = data.filter((obj) => {
    //   return obj;
    // })
    // console.log(filteredData);
    // return filteredData;
  }
