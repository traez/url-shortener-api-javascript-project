(function(){
/*
https://www.frontendmentor.io/challenges/url-shortening-api-landing-page-2ce3ob-G
https://www.frontendmentor.io/solutions/urlshortener-Cn8AqKX5VO
https://github.com/leubomfim/url-shortener
https://leubomfim.github.io/url-shortener/
https://www.shorturl.at/

fixed height for all rows, but auto for url result row that can expand indefinitely
copy url click
error if submit empty
API
local storage, list page
*/

/*
variables to select elements from the DOM 
*/
const shortenBtn = document.querySelector("#shorten-btn");
const enterLink = document.querySelector("#enter-link");
const section = document.querySelector("section");

/*
Global variables
*/
let urlArray = localStorage.getItem('urlItems') ? JSON.parse(localStorage.getItem('urlItems')) : [];

/*
Async function to fetch/get shortened url
*/
async function fetchShortUrl(){
  const url = enterLink.value;
  try {
      const response = await fetch(`https://api.shrtco.de/v2/shorten?url=${url}`);
      const data = await response.json();
      console.log(data);
      populateShortUrl(data);
  } catch (error) {
      console.error(error);
  }
}

/*
function to populate shortened URL on page
*/
function populateShortUrl(data){
  let ul = document.createElement("ul");
  ul.innerHTML = `<li class="url">${data.result.original_link}</li>
  <li class="shortened">${data.result.short_link}</li>
  <li class="copy-shortened">Copy</li>`;
  section.appendChild(ul);
  storeShortUrl(data);
}

/*
function to store shortened URL in local storage so always available
*/
function storeShortUrl(data){
  const random = Math.floor(Math.random() * (99999 - 10000 + 1) + 10000);
  const url = data.result.original_link;
  const shortened = data.result.short_link;
  
  const urlObj = {
    random: random,
    url: url,
    shortened: shortened
  }

  urlArray.push(urlObj);
  localStorage.setItem("urlItems", JSON.stringify(urlArray));
}

/*
addEventListener to confirm input not empty then to run Fetch API to shorten URL
*/
shortenBtn.addEventListener("click", () => {
  if(enterLink.value === ""){
    console.log("Please Enter the link here");
    enterLink.style.border = "2px solid red";
    setTimeout(() => {
      enterLink.style.border = "1px solid rgb(118, 118, 118)";
    }, 4000);
  } else {
    fetchShortUrl();
    setTimeout(() => {
      enterLink.value = "";
    }, 4000);
  }
})

/*
addEventListener which runs async function to copy shortened url so it can be pasted elsewhere
*/
  section.addEventListener("click", async function(e) {
    if(e.target.className === "copy-shortened"){
      try {
        const shortened = e.target.previousElementSibling;
        const text = shortened.textContent;
        await navigator.clipboard.writeText(text);
        console.log("Text copied to clipboard!");
      } catch (err) {
        console.error("Failed to copy text: ", err);
      }
    }
  });
 
/*
function to run pageLoadPopulate function on page load
*/
urlArray.forEach(urlA => {
  pageLoadPopulate(urlA);
})

/*
function to populate page with earlier shortened URLs
*/
function pageLoadPopulate(urlA){
  let ul = document.createElement("ul");
  ul.innerHTML = `<li class="url">${urlA.url}</li>
  <li class="shortened">${urlA.shortened}</li>
  <li class="copy-shortened">Copy</li>`;
  section.appendChild(ul);
}

})();
