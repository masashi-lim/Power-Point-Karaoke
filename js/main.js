"use strict";

const resetButton = document.getElementById("reset");
const startButton = document.getElementById("start");
const img = document.getElementById("img");
const imgAmount = document.getElementById("imgamount");
const countDownP = document.querySelector("#countDown");
let photoDivide = 5;

let imageArray, movieBannerArray;

const themes = ["友達の作り方", "仲直りの仕方", "おいしい朝食"];
let talkingNow = false;

const url = "https://ghibliapi.herokuapp.com/films";

// ↓for test
// const puresenT = 3;
// const photoD = 4;
// const countD = [];

resetButton.addEventListener("click", () => {
  window.location.reload();
});

async function gameStart() {
  const randomNumber = Math.floor(Math.random() * themes.length);
  const themeP = document.querySelector("#theme");
  themeP.innerText = "お題 :" + themes[randomNumber];
  await countDown(10, "スタートまで");
  await countDown(10, "画像まで");
  presenStart();
  for (let i = 1; i <= photoDivide; i++) {
    if (i < photoDivide) {
      await getImage();
      imgAmount.innerText = i + " / 5";
      await countDown(35, "次の画像まで");
    } else {
      img.src = "";
      const concluedP = document.querySelector("#conclued");
      concluedP.innerText = "結論は・・・";
      countDownP.innerText = "";
      await waitSec(10);
      await getImage();
      await waitSec(25);
      imgAmount.innerText = "5 / 5";
      talkingNow = false;
    }
  }
  return true;
}

async function countDown(num, string) {
  for (let i = num; i > 0; i--) {
    await waitSec(1);
    countDownP.innerText = string + " : " + i + " 秒";
  }
}

function waitSec(num) {
  let counter = 0;
  return new Promise((resolve) => {
    setTimeout(() => {
      counter++;
      resolve(counter);
    }, num * 1000);
  });
}

startButton.addEventListener("click", (event) => {
  event.preventDefault();
  gameStart();
});

function presenStart() {
  talkingNow = true;
  const startTime = Date.now();
  const timerP = document.getElementById("timer");
  const presenTimeCount = setInterval(() => {
    if (talkingNow) {
      const timer = new Date(Date.now() - startTime);
      const min = timer.getMinutes();
      const sec = timer.getSeconds();
      const milliSec = timer.getMilliseconds();
      timerP.innerText = min + ":" + sec + ":" + milliSec;
    } else {
      clearInterval(presenTimeCount);
    }
  }, 10);
}

async function getImage() {
  try {
    imageArray = await axios.get(url).then((imgObj) => {
      return imgObj.data.map((imgArray) => {
        return imgArray["image"];
      });
    });
    movieBannerArray = await axios.get(url).then((imgObj) => {
      return imgObj.data.map((imgArray) => {
        return imgArray["movie_banner"];
      });
    });
    selectImage();
  } catch (err) {
    throw new Error(err);
  }
}

function selectImage() {
  const allImages = [];
  imageArray.forEach((img) => allImages.push(img));
  movieBannerArray.forEach((img) => allImages.push(img));
  console.log("allImages: ", allImages);
  let randomNumberTwo = Math.floor(Math.random() * allImages.length);
  let selectedUrl = allImages[randomNumberTwo];
  console.log("selectedUrl: ", selectedUrl);
  img.src = selectedUrl;
}
