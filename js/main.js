"use strict";

const resetButton = document.getElementById("reset");
const startButton = document.getElementById("start");
const img = document.getElementById("img");
const imgAmount = document.getElementById("imgamount");
const countDownP = document.querySelector("#countDown");
let presenTimeValue, photoDivideValue;

// console.log('prVal: ', presenTimeValue);
// console.log('photoVal: ', photoDivideValue);

let imageArray, movieBannerArray;
let talkingNow = false;

const themes = ["友達の作り方", "仲直りの仕方", "ストレス発散方法"];
const url = "https://ghibliapi.herokuapp.com/films";

// ↓for test
// const puresenT = 3;
// const photoD = 4;
// const countD = [];

const timeTable = {
  "1-3": [5, 20, 10],
  "1-5": [5, 10, 10],
  "1-7": [5, 7, 7],
  "3-3": [10, 60, 40],
  "3-5": [10, 35, 25],
  "3-7": [10, 25, 10],
  "5-3": [15, 120, 30],
  "5-5": [15, 60, 30],
  "5-7": [15, 40, 30]
}

resetButton.addEventListener("click", () => {
  window.location.reload();
});

startButton.addEventListener("click", (event) => {
  // event.preventDefault();
  presenTimeValue = document.getElementById("puresentime").value;
  photoDivideValue = document.getElementById("numberofimg").value;
  let key = presenTimeValue + "-" + photoDivideValue;
  let timeTableArray = timeTable[key];
  gameStart(timeTableArray);
});

async function gameStart(array) {
  const randomNumber = Math.floor(Math.random() * themes.length);
  const themeP = document.querySelector("#theme");
  themeP.innerText = "お題 :" + themes[randomNumber];
  await countDown(array[0], "スタートまで");
  // await countDown(3, "画像まで");
  presenStart();
  for (let i = 1; i <= photoDivideValue; i++) {
    if (i < photoDivideValue) {
      await getImage();
      imgAmount.innerText = i + " / " + photoDivideValue;
      await countDown(array[1], "次の画像まで");
    } else {
      img.src = "";
      const concluedP = document.querySelector("#conclued");
      concluedP.innerText = "結論は・・・";
      countDownP.innerText = "";
      await waitSec(5);
      await getImage();
      imgAmount.innerText = i + " / " + photoDivideValue;
      await waitSec(array[2]);
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
