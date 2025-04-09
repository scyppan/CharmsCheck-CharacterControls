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


async function gettraits() {
  if (!traits) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching traits...");
      traits = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/979/entries?page_size=10000");

      if (!traits) {
        console.error("Failed to fetch traits: Data is invalid.");
      } else {
        console.log("Traits successfully loaded:", Array.from(Object.values(traits)).length, "traits found.");
      }

    } catch (err) {
      console.error("Trait fetch error:", err);
      traits = []; // Prevent future calls from failing
    }
  }
}


async function getaccessories() {
  if (!accessories) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching accessories...");
      accessories = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/995/entries?page_size=10000");

      if (!accessories) {
        console.error("Failed to fetch traits: Data is invalid.");
      } else {
        console.log("Traits successfully loaded:", Array.from(Object.values(accessories)).length, "accessories found.");
      }

    } catch (err) {
      console.error("accessory fetch error:", err);
      accessories = []; // Prevent future calls from failing
    }
  }
}


async function getwands() {
  if (!wands) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching wands...");
      wands = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/114/entries?page_size=10000");

      if (!wands) {
        console.error("Failed to fetch wands: Data is invalid.");
      } else {
        console.log("wands successfully loaded:", Array.from(Object.values(wands)).length, "wands found.");
      }

    } catch (err) {
      console.error("wands fetch error:", err);
      wands = []; // Prevent future calls from failing
    }
  }
}