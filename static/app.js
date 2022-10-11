const btn = document.getElementById("submit-button")
const scoreText = (document.getElementById("current-score"))


let currScore = 0
let time = 60
const playedWords = []



async function sendGuess(word) {
    let response = await axios.get("/guess", {params: {"word": word}})
    showResult(response, word)
}
async function saveGame(score) {
    let response = await axios.post("/submit-score", {"score": score})
}

async function showResult(response, word) {
    let res = response["data"]["result"]
    if (res == "ok") {
        alert("Score!")
        putWordInResults(word)
        updateScore(word)
    } 
    if (res == "not-on-board") {
        alert("That word is not on the board")
    }
    if (res == "not-word") {
        alert("That is not a word")
    } 
    
}

async function putWordInResults(word) {
    let results = document.getElementById("result")
    let newLi = document.createElement("li")
    playedWords.push(word)
    newLi.innerHTML = `<li>${word}</li>`
    results.append(newLi);
}

async function updateScore(word) {
    let points = word.length
    currScore += points;
    scoreText.innerText = currScore
}

btn.addEventListener("click", function(e){
    e.preventDefault();
    guessInput = document.getElementById("guess-input")
    if (time < 0) {
    guessInput.value = ""       
    return alert("Time has expired")
    }
    if (playedWords.includes(guessInput.value)) {
        return alert("Word is already played!")
    } 
    sendGuess(guessInput.value)
    guessInput.value = ""    
})

let interval = setInterval(timer, 1000);
let timerText = (document.getElementById("timer"))
    function timer() {
    timerText.innerText = `:${time}`
    time -= 1
    if (time == -1){
    clearInterval(interval)
    alert("Game Over. Time's out!")
    endGame()
}
}

async function endGame() { 
    await saveGame(currScore)
}
