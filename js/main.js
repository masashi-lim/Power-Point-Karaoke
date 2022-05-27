"use strict";

const resetButton = document.getElementById("reset");
const startButton = document.getElementById("start");
const img = document.getElementById("img");
const imgAmount = document.getElementById("imgamount");
const countDownP = document.querySelector("#countDown");
const header = document.querySelector("header");
const imgSelector = document.getElementById("imageSelector");
const numOfImgSelector = document.getElementById("numberofimg");
let presenTimeValue, photoDivideValue;
let ownImageFlg = false;
let ownImageBlobs = [];

numOfImgSelector.addEventListener("change", () => {
  // フラグを更新
  ownImageFlg = imgSelector.files.length >= numOfImgSelector.value;
});

imgSelector.addEventListener("change", () => {
  ownImageFlg = imgSelector.files.length >= numOfImgSelector.value;
  // プレゼンに必要な枚数以上を選択できているか
  if (ownImageFlg) {
    // imgタグのsrcに設定するための処理
    const blobs = [];
    for (const img of imgSelector.files) {
      // blob urlを作成
      blobs.push(window.URL.createObjectURL(img));
    }
    ownImageBlobs = blobs;
    console.log("file selected");
  }
});

// sp mode ↓
const spHidden = document.getElementsByClassName("special");
const specialPics = [
  "PPKM_special_pics/PPKM1.jpg",
  "PPKM_special_pics/PPKM2.jpg",
  "PPKM_special_pics/PPKM3.jpg",
  "PPKM_special_pics/PPKM4.jpg",
  "PPKM_special_pics/PPKM5.jpg",
  "PPKM_special_pics/PPKM6.jpg",
  "PPKM_special_pics/PPKM7.jpg",
  "PPKM_special_pics/PPKM8.jpg",
];
// sp mode ↑

let imageArray, movieBannerArray;
let talkingNow = false;

const themes = [
  "友達の作り方",
  "仲直りの仕方",
  "ストレス発散方法",
  "人に優しくする方法",
  "宿題の頑張り方",
  "やる気を出す方法",
];
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
  "5-7": [15, 40, 30],
};

resetButton.addEventListener("click", () => {
  window.location.reload();
});

startButton.addEventListener("click", () => {
  // sp mode ↓
  const spmode = document.getElementById("spmode");
  if (spmode.checked === true) {
    spHidden[0].classList.toggle("hidden");
    spHidden[1].classList.toggle("hidden");
    spHidden[2].classList.toggle("hidden");
    spHidden[3].classList.toggle("hidden");
    spHidden[4].classList.toggle("hidden");
    specialGameStart();
    // sp mode ↑
  } else {
    presenTimeValue = document.getElementById("puresentime").value;
    photoDivideValue = document.getElementById("numberofimg").value;
    let key = presenTimeValue + "-" + photoDivideValue;
    let timeTableArray = timeTable[key];
    header.classList.toggle("hidden");
    spHidden[3].classList.toggle("hidden");
    spHidden[4].classList.toggle("hidden");
    gameStart(timeTableArray);
  }
});

// sp mode ↓
async function specialGameStart() {
  document.body.style.color = "lightgray";
  const newImage = document.createElement("img");
  newImage.style.height = "600px";
  document.body.appendChild(newImage);
  for (let i = 0; i <= 7; i++) {
    newImage.src = specialPics[i];
    console.log("newImage: ", newImage);
    if (i === 6) {
      // await waitSec(25);
      await waitSec(3);
    } else if (i === 5) {
      // await waitSec(5);
      await waitSec(3);
    } else if (i >= 1) {
      // await waitSec(35);
      await waitSec(3);
    } else {
      // await waitSec(10);
      await waitSec(3);
    }
  }
}

// sp mode ↑

async function gameStart(array) {
  const concluedP = document.querySelector("#conclued");
  // 2回目のために初期化
  concluedP.innerText = "";
  img.src = "";

  // テーマをランダムに決める
  const randomNumber = Math.floor(Math.random() * themes.length);
  const themeP = document.querySelector("#theme");
  themeP.innerText = "お題 :" + themes[randomNumber];

  await countDown(array[0], "スタートまで");
  // apiで画像を取ってくる
  await getImage();
  // ストップウォッチをスタートさせる
  presenStart();
  for (let i = 1; i <= photoDivideValue; i++) {
    if (i < photoDivideValue) {
      // 写真を更新
      selectImage();
      imgAmount.innerText = i + " / " + photoDivideValue;
      await countDown(array[1], "次の画像まで");
    } else {
      img.src = "";
      concluedP.innerText = "結論は・・・";
      countDownP.innerText = "";
      await waitSec(5);
      // 写真を更新
      selectImage();
      imgAmount.innerText = i + " / " + photoDivideValue;
      await waitSec(array[2]);
      talkingNow = false;
      header.classList.toggle("hidden");
    }
  }
  return true;
}

async function countDown(num, string) {
  for (let i = num; i >= 0; i--) {
    countDownP.innerText = string + " : " + i + " 秒";
    await waitSec(1);
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
        console.log("imgArray: ", imgArray);
        return imgArray["image"];
      });
    });
    movieBannerArray = await axios.get(url).then((imgObj) => {
      return imgObj.data.map((imgArray) => {
        return imgArray["movie_banner"];
      });
    });
  } catch (err) {
    throw new Error(err);
  }
}

function selectImage() {
  const allImages = [];
  if (ownImageFlg) {
    ownImageBlobs.forEach((blob) => allImages.push(blob));
  } else {
    imageArray.forEach((img) => allImages.push(img));
    movieBannerArray.forEach((img) => allImages.push(img));
  }
  let randomNumberTwo = Math.floor(Math.random() * allImages.length);
  let selectedUrl = allImages[randomNumberTwo];
  img.src = selectedUrl;
}
