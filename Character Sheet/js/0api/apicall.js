let headers = new Headers();
headers.append("Authorization", "Basic Q0E2RS1LUjdaLUtCT0wtTlVYUTp4");
let requestoptions = {
  method: 'GET',
  headers: headers,
  redirect: 'follow'
};

// main api call function
async function fetchjson(url) {
  let res = await fetch(url, requestoptions);
  if (res.status === 200) {
    hidegif();//loadgiflogic.js
    createfuse();//searchbox.js
    return res.json();
  }
  throw new Error(res.status);
}

const fetchdata = (url) => fetchjson(url);
