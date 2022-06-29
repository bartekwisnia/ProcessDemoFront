//export const global_url = 'http://localhost:8000/';
export const global_url = 'https://earnest-runner-354720.lm.r.appspot.com/';

function getData(endpoint, token){
  return new Promise((resolve, reject) => {
    let url = global_url+endpoint;
    fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Token ' + token,

      }}
    ).then(response => {
        if (response.status !== 200) {
          return 0;
        }
        return response.json();
      })
      .then(data => {
          resolve(data);
        }).catch(error => {reject(error)});
     });
}

function writeData(endpoint, method, token, value){

  return new Promise((resolve, reject) => {
    if(method!=='PUT' && method!=='POST'){
      reject("wrong method");
    }
    else{
      let url = global_url+endpoint;
      fetch(url, {
        method: method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,},
        body: JSON.stringify(value),
      }
      ).then(response => {
          if (response.status < 200 || response.status >=300) {
            reject(response)
          }
          return response.json();
        })
        .then(data => {
            resolve(data);
          }).catch(error => {reject(error)});
       }
     }
     );
}

function destroyData(endpoint, token){

  return new Promise((resolve, reject) => {
      let url = global_url+endpoint;
      fetch(url, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': 'Token ' + token,}
      }
      ).then(response => {
            if (response.status === 204) {
              resolve()
            }
            else {
              reject()
            }
          }).catch(error => {reject(error)});
     }
     );
}


function precision(num, dec){
  const num_abs = Math.abs(num)
  const val_string = num_abs.toString();
  const for_dott = val_string.split(".")[0];
  const aft_dott = val_string.split(".")[1];

  if (num_abs < 1.0 && aft_dott !== undefined){
    let index = 0;
    for (let i = 0; i < aft_dott.length; i++ ) {
      if (Number(aft_dott[i]) > 0)
        {
        index = i+1;
        break;
        }
      }
    return index + dec - 1;
  }
  else {
    return dec - for_dott.length < 0 ? 0 : dec - for_dott.length;
  }
}


export {
  getData, writeData, destroyData, precision}
