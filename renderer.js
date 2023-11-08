const setButton = document.getElementById('urlSubmitButton');
const urlInput = document.getElementById('urlInput');

let checkInterval = undefined;
let hasWorkedOnce = false;

setButton.addEventListener('click', () => {
    hasWorkedOnce = false;
    if (checkInterval != undefined) {
        clearInterval(checkInterval);
    }
    checkInterval = setInterval(updateScore, 3000);
    //checkInterval = setInterval(fakeUpdateScore, 3000);
});


async function updateScore() {
    try {
        document.getElementById('txtOutput').textContent = "";

        let data = await window.electronAPI.getMatchUrl(urlInput.value);

        var el = document.createElement('html');
        el.innerHTML = data;

        let table = el.querySelectorAll(".container .row .col-md-8")[0]
        let playerAName = table.getElementsByClassName("text-left")[0].textContent.trim("\n");
        let playerBName = table.getElementsByClassName("text-right")[0].textContent.trim("\n");

        let gameScoreNode = table.getElementsByClassName("game-total")[0];
        let gameScores = gameScoreNode.textContent.split("-");

        let currentGameIdx = parseInt(gameScores[0]) + parseInt(gameScores[1]);

        let gamePointsNode = table.getElementsByClassName("text-center")[0];
        gamePointsNode.removeChild(gameScoreNode);
        let gamePointsArray = gamePointsNode.textContent.split(",");

        let gamePoints = [0, 0]; // default value, for when the next game score isn't up yet..
        if (currentGameIdx < gamePointsArray.length) {
            gamePoints = gamePointsArray.pop().split("-");
        }

        document.getElementById('playerAName').textContent = shortenName(playerAName);
        document.getElementById('playerAGames').textContent = gameScores[0];
        document.getElementById('playerAPoints').textContent = gamePoints[0];

        document.getElementById('playerBName').textContent = shortenName(playerBName);
        document.getElementById('playerBGames').textContent = gameScores[1];
        document.getElementById('playerBPoints').textContent = gamePoints[1];

        //document.getElementById('scoreContainer').style.visibility = "visible";
        hasWorkedOnce = true;
    }
    catch (err) {
        if (!hasWorkedOnce) { // Only clear the interval if it hasn't worked at all. It might just be sportyhq error that the exception happened once off, and we don't want to stop it refreshing then.
            clearInterval(checkInterval);
        }
        else {
            console.log("An error occurred when it had been working before with the same URL.", err);
        }
        document.getElementById('txtOutput').textContent = "Error setting the url. Please try again. It should be of a format like: https://www.sportyhq.com/tournament/tv_scores/10186/5248";
        //document.getElementById('scoreContainer').style.visibility = "hidden";

    }

}

function shortenName(name) {
    if (name.length > 15) {
        let names = name.split(" ");
        names[0] = names[0][0];
        return names.join(" ");
    }
    else {
        return name;
    }
}

async function fakeUpdateScore() {
    document.getElementById('txtOutput').textContent = "";

    document.getElementById('playerAName').textContent = shortenName("Bonifaceus Lemagnificius");
    document.getElementById('playerAGames').textContent = 1;
    document.getElementById('playerAPoints').textContent = 2;

    document.getElementById('playerBName').textContent = shortenName("Mark Todd");
    document.getElementById('playerBGames').textContent = 3;
    document.getElementById('playerBPoints').textContent = 7;

    document.getElementById('scoreContainer').style.visibility = "visible";
}
