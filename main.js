window.onload =function(){

var ans;
var body = document.querySelector("body");
var buttonArea = document.getElementById("pickatopic");
var buttons = [];
var topicNumber = 0;
var questionArea = document.getElementById("question-area");
var answerArea  =document.getElementById("answers");
var correct = document.getElementById("correct");
var score = document.getElementById("score");
var questionsRemaining = document.getElementById("question-remaining");
var count=0;
var alreadyPlayed = true;
var scoreCount = 0;
var questionsRemainingCount = 10;

runXHR();



function runXHR(){
    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
    if (XHR.readyState == 4 && XHR.status == 200) {

    ans = JSON.parse(XHR.responseText);
    for (var i=0; i<ans["trivia_categories"].length; i++){
    var btn = document.createElement("button");
    btn["value"] = ans["trivia_categories"][i]["name"];
    btn.classList.add("topic-buttons")
    btn.setAttribute("id", ans["trivia_categories"][i]["id"])
    btn.innerText = ans["trivia_categories"][i]["name"];
    buttons.push(btn);
    buttonArea.append(btn);

        chooseTopic();
}

}}
XHR.open("GET", "https://opentdb.com/api_category.php", true);
XHR.send();
}



function chooseTopic(){

    for(var i=0;i<buttons.length;i++){
    buttons[i].addEventListener("click", function(e){

        for (var i=0; i<buttons.length; i++){
        buttons[i].style.opacity = "0"
    }

        /*.add(".button-chosen");
        var topic = document.getElementById("topic");*/
        topic.innerText = "Topic: " + e.target["value"]
        topic.style.opacity ="1";
        topicNumber = e.target["id"];
        if (alreadyPlayed===true){
        getQuestions(topicNumber)}
        alreadyPlayed = false;
    })
}

}


function getQuestions(topicNumber){

    var XHR = new XMLHttpRequest();
    XHR.onreadystatechange = function() {
    if (XHR.readyState == 4 && XHR.status == 200) {
    ans = JSON.parse(XHR.responseText);

    ans = ans["results"];
    console.log(ans);


    runQuiz(ans);

}}
XHR.open("GET", "https://opentdb.com/api.php?amount=10&category=" + topicNumber, true);
XHR.send();
}

function runQuiz(ans){

    while (answerArea.firstChild) {
    answerArea.removeChild(answerArea.firstChild);
}
    correct.style.opacity  = 0;
    answerArea.style.opacity = 1;
    questionArea.style.opacity = 1;

    questionArea.innerHTML = ans[count]["question"];
    if (ans[count]["type"] === "multiple"){
        for(var i=0; i<3; i++){
        var div = document.createElement("div");
        div.classList.add("answer");
        div.innerHTML = ans[count]["incorrect_answers"][i];
        answerArea.append(div);
    }
    var div = document.createElement("div");
        div.classList.add("answer");
        div.innerHTML = ans[count]["correct_answer"];
       answerArea.append(div);
       var answers = document.querySelectorAll(".answer");
            for (var i=0; i<answers.length; i++){
                answers[i].style.order = Math.floor(Math.random()*4)+1;
            }
}
    if(ans[count]["type"]==="boolean"){
       var div = document.createElement("div");
        div.classList.add("answer");
        div.innerHTML = "True";
        div.setAttribute("value", "true");
        answerArea.append(div);
        var div = document.createElement("div");
        div.classList.add("answer");
        div.innerHTML = "False";
        div.setAttribute("value", "false");
        answerArea.append(div);
    }
pickAnswer();
}



function pickAnswer(){
    var answers = document.querySelectorAll(".answer");
        for (var i=0; i<answers.length; i++){
                answers[i].addEventListener("click", function(e){
                    console.log(e.target.innerHTML);
                    console.log(ans[count]["correct_answer"]);
                    console.log(ans[count]);
                    console.log(count);
                    console.log(ans);
                    if(e.target.innerHTML.toUpperCase() === ans[count]["correct_answer"].toUpperCase()){

                    correct.innerText = "You got it!";
                    correct.style.color = "green";
                    updateScore();

                }
                else {
                    correct.innerText = "Bad luck!"
                    correct.style.color = "red";
                }
                updateQuestionsRemaining()
                correct.style.opacity  = 1;
                answerArea.style.opacity = 0;
                questionArea.style.opacity = 0;
                var timerId = setTimeout(function(){
                    ++count;
                    if (count<10){
                    runQuiz(ans);
                }
                else{
                    newGame();
                }
                    },2000);

                })
            }
        }

function newGame(){
    var endGame = document.createElement("div");
    endGame.setAttribute("id", "end-game");
    body.append(endGame);
    var lastWords = document.createElement("div");
    lastWords.setAttribute("id", "last-words");
    if (scoreCount<4){
        lastWords.innerText = "That's pretty disappointing. You only scored "
            + scoreCount + " out of 10!"
    }
    else if(scoreCount>3 && scoreCount<8){
        lastWords.innerText = "Not bad. You scored "
            + scoreCount + " out of 10!"
    }
    else {
    lastWords.innerText = "That's pretty impressive. You scored "
            + scoreCount + " out of 10!"
    }
    endGame.append(lastWords);
    var button = document.createElement("button");
    button.setAttribute("id", "play-again");
    button.innerText = "Play Again?"
    button.addEventListener("click", function(){
        location.reload();
    })
    lastWords.append(button);

}


function updateScore(){
    ++scoreCount;
    score.innerText = "Score: " + scoreCount;
}
function updateQuestionsRemaining(){
    --questionsRemainingCount;
    questionsRemaining.innerText = "Questions Remaining: " + questionsRemainingCount;
}


};