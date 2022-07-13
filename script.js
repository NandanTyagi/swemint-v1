import shortenAddress from "./utility/shortenAddress";
const init = async () => {
  const days = document.getElementById("days");
  const hours = document.getElementById("hours");
  const minutes = document.getElementById("minutes");
  const seconds = document.getElementById("seconds");
  const countdown = document.getElementById("countdown");
  const loading = document.getElementById("loading");
  const btn = document.getElementById("btn");
  const err = document.getElementById("error");
  const msg = document.getElementById("msg");

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

  user = Moralis.User.current();

  if (user) {
    console.log("logged in user: ", user);
    btn.innerText = "Disconnect wallet";
  }

  async function loginMetamask(user) {
    console.log("logged in user:", user);
    // err.style.visibility = "hidden";
    if (!user) {
      user = await Moralis.authenticate({
        signingMessage: "Log in using Moralis",
      })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
          let address = user.get("ethAddress");
          msg.innerHTML = shortenAddress(address);
          msg.style.visibility = 'visible'
          btn.innerText = "Disconnect wallet";
        })
        .catch(function (error) {
          console.log(error);
          err.style.visibility = 'visible'
          err.innerHTML = error.message;
          setTimeout(()=>{
            err.style.visibility = 'hidden'
          },10000)
        });
    }
  }
  

  async function loginWalletConnect() {
    err.innerHTML = "";
    let user = Moralis.User.current();
    if (!user) {
      const user = await Moralis.authenticate({
        provider: "walletconnect",
        mobileLinks: [
          "rainbow",
          "metamask",
          "argent",
          "trust",
          // "imtoken",
          // "pillar",
        ],
        signingMessage: "Log in using Moralis",
      })
        .then(function (user) {
          console.log("logged in user:", user);
          console.log(user.get("ethAddress"));
        })
        .catch(function (error) {
          console.log(error);
          err.innerHTML = error.message;
        });
    }
  }

  async function logOut() {
    await Moralis.User.logOut();
    console.log("logged out");
    btn.innerText = "Connect wallet";
    msg.innerText = 'Disconected'
    setTimeout(()=>{
      msg.style.visibility = 'hidden'
    },3000)
  }

  function connectionCheck() {
    if (btn.innerText === "CONNECT WALLET") {
      loginMetamask()
    }
    if (btn.innerText === "DISCONNECT WALLET") {
      logOut()
    }
  }
  
  btn.addEventListener("pointerup", () => connectionCheck());
};

document.addEventListener("DOMContentLoaded", () => init());
