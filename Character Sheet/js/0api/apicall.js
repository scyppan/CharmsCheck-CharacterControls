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

async function getwandwoods() {
  if (!wandwoods) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching wand woods...");
      wandwoods = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/120/entries?page_size=10000");

      if (!wandwoods) {
        console.error("Failed to fetch wand woods: Data is invalid.");
      } else {
        console.log("wand woods successfully loaded:", Array.from(Object.values(wandwoods)).length, "wand woods found.");
      }

    } catch (err) {
      console.error("wand woods fetch error:", err);
      wandwoods = []; // Prevent future calls from failing
    }
  }
}

async function getwandcores() {
  if (!wandcores) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching wand cores...");
      wandcores = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/116/entries?page_size=10000");

      if (!wandcores) {
        console.error("Failed to fetch wand cores: Data is invalid.");
      } else {
        console.log("wand cores successfully loaded:", Array.from(Object.values(wandcores)).length, "wand cores found.");
      }

    } catch (err) {
      console.error("wand cores fetch error:", err);
      wandcores = []; // Prevent future calls from failing
    }
  }
}

async function getwandqualities() {
  if (!wandqualities) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching wand qualities...");
      wandqualities = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/124/entries?page_size=10000");

      if (!wandqualities) {
        console.error("Failed to fetch wand qualities: Data is invalid.");
      } else {
        console.log("wand qualities successfully loaded:", Array.from(Object.values(wandqualities)).length, "wand qualities found.");
      }

    } catch (err) {
      console.error("wand qualities fetch error:", err);
      wandqualities = []; // Prevent future calls from failing
    }
  }
}

async function getwandmakers() {
  if (!wandmakers) {  // Only fetch if we don't already have traits
    try {
      console.log("Fetching wand makers...");
      wandmakers = await fetchdata("https://charmscheck.com/wp-json/frm/v2/forms/115/entries?page_size=10000");

      if (!wandmakers) {
        console.error("Failed to fetch wand makers: Data is invalid.");
      } else {
        console.log("wand makers successfully loaded:", Array.from(Object.values(wandmakers)).length, "wand makers found.");
      }

    } catch (err) {
      console.error("wand makers fetch error:", err);
      wandmakers = []; // Prevent future calls from failing
    }
  }
}