const days = document.getElementById("days");
const hours = document.getElementById("hours");
const minutes = document.getElementById("minutes");
const seconds = document.getElementById("seconds");
const countdown = document.getElementById("countdown");
const loading = document.getElementById("loading");
const btn = document.getElementById("btn");
const err = document.getElementById("error");

const currentYear = new Date().getFullYear();

const mintDeadLine = new Date(`August 20 ${currentYear} 18:00:00`);

// Update time countdown
function updateCountdown() {
  const currentTime = new Date();
  const diff = mintDeadLine - currentTime;
  const d = Math.floor(diff / 1000 / 60 / 60 / 24);
  const h = Math.floor(diff / 1000 / 60 / 60) % 24;
  const m = Math.floor(diff / 1000 / 60) % 60;
  const s = Math.floor(diff / 1000) % 60;

  // Add values to DOM
  days.innerHTML = d + ":";
  hours.innerHTML = h < 10 ? "0" + h + ":" : h + ":";
  minutes.innerHTML = m < 10 ? "0" + m + ":" : m + ":";
  seconds.innerHTML = s < 10 ? "0" + s : s;
}

//Show spinner before countdown
setTimeout(() => {
  loading.remove();
}, 1000);

// Run every second
setInterval(updateCountdown, 1000);


// Moralis
const serverUrl = "https://fgobknghleyp.usemoralis.com:2053/server";
const appId = "b6IxjhUZhcj7B3Y1TxRcyKGVPqICIlr4rDVVlTZ4";

Moralis.start({ serverUrl, appId });

async function login() {
    err.innerHTML = ''
  let user = Moralis.User.current();
  if (!user) {
    user = await Moralis.authenticate({
      signingMessage: "Log in using Moralis",
    })
      .then(function (user) {
        console.log("logged in user:", user);
        console.log(user.get("ethAddress"));
      })
      .catch(function (error) {
        console.log(error);
        err.innerHTML = error.message
      });
  }
}

async function logOut() {
  await Moralis.User.logOut();
  console.log("logged out");
}

btn.addEventListener('pointerup', (e) => login())