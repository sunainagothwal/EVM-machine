const candidates = [
  {
    id: 1,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 2,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 3,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 4,
    name: "श्री.परमेश्वर मारिबा घोरपडे",
    photo: "candidate.jpeg",
    symbol: "logo.jpeg",
  },
  {
    id: 5,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 6,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 7,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 8,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 9,
    name: "",
    symbol: "",
    photo: "",
  },
  {
    id: 10,
    name: "NOTA",
    symbol: "",
  },
];

let bulbActionInProgress = false;

function getStoredVoteCount() {
  return localStorage.getItem("voteCount")
    ? parseInt(localStorage.getItem("voteCount"))
    : 0;
}

function setStoredVoteCount(count) {
  localStorage.setItem("voteCount", count);
}

document.addEventListener("DOMContentLoaded", function () {
  const rows = Array.from({ length: 10 }, (_, i) => {
    const candidate = candidates[i];
    return `
              <tr>
                <td class="main-col" style="background-color: #f0f0ad;">${
                  candidate.id
                }</td>
               <td class="main-col candidate-name" style="background-color: #f0f0ad;">
      <div style="display: flex; align-items: center; gap: 10px; justify-content: center;">
        <span>${candidate.name}</span>
        ${
          candidate.photo
            ? `<img src="./assets/${candidate.photo}" alt="Photo" width="60" height="60" style="border-radius: 50%;">`
            : ""
        }
      </div>
    </td>
    
                <td class="main-col " style="background-color: #f0f0ad;">
                  ${
                    candidate && candidate.symbol
                      ? `<div style="mix-blend-mode: multiply;">
                      <img src="./assets/${candidate.symbol}" width="50">
                    </div>`
                      : ""
                  }
                </td>
                <td class="side-col" style="background-color: #f2f2f2 ;">
                  <img src="./assets/blueButton.jpeg" alt="Bulb" id="bulb-${
                    candidate.id
                  }" width="20">
                </td>
                <td class="side-col"style="background-color: #f2f2f2;">
                ${
                  (candidate.name || candidate.photo || candidate.symbol) &&
                  candidate.name !== "NOTA"
                    ? `<button class="voting_btn" 
                        data-candidate='${JSON.stringify(candidate)}'
                        onclick="handleVoteBtnPress(this)">बटन दाबा</button>`
                    : ""
                }
                </td>
              </tr>
            `;
  }).join("");

  document.getElementById("tableBody").innerHTML = rows;

  updateBallotSlipVoteCount();
});

let voteCount = getStoredVoteCount();

function handleVoteBtnPress(btnInfo) {
  const candidateInfo = JSON.parse(btnInfo.getAttribute("data-candidate"));
  if (bulbActionInProgress) return;
  bulbActionInProgress = true;

  const buttons = document.querySelectorAll("button.voting_btn");
  buttons.forEach((btn) => (btn.disabled = true));

  const bulbElement = document.getElementById("bulb-" + candidateInfo.id);
  if (bulbElement) {
    bulbElement.src = "./assets/bulb_red.png";
  }

  const greenBulb = document.getElementById("green_blb");
  if (greenBulb) {
    greenBulb.src = "./assets/bulb_red.png";
    greenBulb.style.backgroundColor = "red";
  }
  var beep = new Audio("./assets/beep.mpeg");
  beep.play();

  beep.onended = function () {
    showVVPATPopup(candidateInfo);
  };
}

function showVVPATPopup(candidate) {
  const popup = document.getElementById("vvpat-popup");
  const slip = document.getElementById("ballot-slip");
  const slipName = document.getElementById("slip-name");
  const slipSymbol = document.getElementById("slip-symbol");
  const slipPhoto = document.getElementById("slip-photo");

  slipName.textContent = ` ${candidate.name}`;
  slipSymbol.src = `./assets/${candidate.symbol}`;
  slipPhoto.src = `./assets/${candidate.photo}` || "";

  slip.style.display = "block";
  slip.style.animation = "none";
  void slip.offsetWidth;
  slip.style.animation = "slipEject 2s ease forwards";

  popup.style.display = "flex";

  let doneVoting = new Audio("./assets/donevote.mpeg");
  doneVoting.play();

  doneVoting.onended = function () {
    slip.style.display = "none";
    popup.style.display = "none";

    const bulbElement = document.getElementById("bulb-" + candidate.id);
    if (bulbElement) {
      bulbElement.src = "./assets/blueButton.jpeg";
    }

    const greenBulb = document.getElementById("green_blb");
    if (greenBulb) {
      greenBulb.src = "./assets/green.png";
    }

    document
      .querySelectorAll("button.voting_btn")
      .forEach((btn) => (btn.disabled = false));

    bulbActionInProgress = false;

    voteCount++;
    setStoredVoteCount(voteCount);
    updateBallotSlipVoteCount();
  };
}

function updateBallotSlipVoteCount() {
  const countElement = document.getElementById("vote-count");
  if (countElement) {
    countElement.textContent = voteCount;
  }
}

function errorBeep() {
  const error = new Audio("./assets/error.mpeg");
  error.play();
}

function playDemoSound() {
  let demoVote = new Audio("./assets/demovote.mpeg");
  demoVote.play();
}

function updateViewCount() {
  let count = localStorage.getItem("viewCount")
    ? parseInt(localStorage.getItem("viewCount"))
    : 0;
  count++;
  localStorage.setItem("viewCount", count);
  document.getElementById("count").textContent = count;
}

window.onload = function () {
  updateViewCount();

  const demoVoteSound = document.getElementById("demo-vote-sound");
  if (demoVoteSound) {
    demoVoteSound
      .play()
      .catch((error) => console.log("Audio autoplay blocked:", error));
  }
};
