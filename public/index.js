import config from "./quiz_data/quiz_dataa.json" assert { type: 'json' };
;
import { TimeFormatter } from './TimeFormatter.js';
localStorage.clear();
const startBtn = document.getElementById('start');
const nextBtn = document.getElementById('next');
const backBtn = document.getElementById('back');
const endBtn = document.getElementById('end');
const quizInfo = document.getElementById('quizInfo');
const quizTitle = document.getElementById('quizTitle');
const questionContainer = document.getElementById('question-container');
const totalTime = document.querySelector('#totalTime');
const questionTimeNode = document.querySelector("#questionTime");
const timeContainer = document.querySelector('.timeContainer');
const buttonsContainer = document.querySelector('.buttonsContainer');
const startInfo = document.querySelector('.wrapper');
const timeFormatter = new TimeFormatter();
const lastQuestionIndex = config.questions.length - 1;
let questionTimeInterval;
let totalTimeInterval;
let currentIndex = 0;
let totalQuizTime = 0;
quizTitle.innerText = config.title;
quizInfo.innerText = config.quizInfo;
startBtn.addEventListener('click', () => startQuiz());
nextBtn.addEventListener('click', () => nextQuestion());
backBtn.addEventListener('click', () => previousQuestion());
endBtn.addEventListener('click', () => endQuiz());
function endQuiz() {
    stopCounter(questionTimeInterval);
    stopCounter(totalTimeInterval);
    endBtn.disabled = true;
    nextBtn.disabled = true;
    backBtn.disabled = true;
    questionContainer.hidden = true;
    createResultDialog();
}
function startQuiz() {
    config.questions.forEach((question, index) => {
        localStorage.setItem(`TimeSpent on Q${index}`, '0');
    });
    localStorage.setItem('TotalQuizTime', totalQuizTime.toString());
    createQuestion(currentIndex);
    startCounter(totalTime);
    startCounter(questionTimeNode);
    timeContainer.hidden = false;
    buttonsContainer.hidden = false;
    startInfo.hidden = true;
}
function nextQuestion() {
    if (!(currentIndex >= lastQuestionIndex) && currentIndex >= 0) {
        currentIndex++;
        createQuestion(currentIndex);
        setButtonState(nextBtn);
        stopCounter(questionTimeInterval);
        startCounter(questionTimeNode);
    }
}
function previousQuestion() {
    if (!(currentIndex >= lastQuestionIndex + 1) && currentIndex >= 0) {
        currentIndex--;
        createQuestion(currentIndex);
        setButtonState(backBtn);
        stopCounter(questionTimeInterval);
        startCounter(questionTimeNode);
    }
}
function createResultDialog() {
    const resultDialog = document.createElement('dialog');
    const answerContainer = document.createElement('div');
    config.questions.forEach((question, ind) => {
        const p = document.createElement('p');
        const lu = document.createElement('lu');
        const timeSpent = document.createElement('a');
        timeSpent.innerText = `Time spent on this Question: ${timeFormatter.timeFormatter(getItemFromStorageAsNumber(`TimeSpent on Q${ind}`))}`;
        timeSpent.style.marginTop = '5px';
        p.innerText = question.formula;
        question.answers.forEach(answer => {
            const answerElement = document.createElement('li');
            answerElement.innerText = answer;
            if (question.correctAnswer === localStorage.getItem(`Answer ${ind}`)) {
                if (answer === question.correctAnswer) {
                    answerElement.style.background = 'green';
                }
            }
            else {
                if (answer === question.correctAnswer) {
                    answerElement.style.background = 'yellow';
                }
                else if (answer === localStorage.getItem(`Answer ${ind}`)) {
                    answerElement.style.background = 'red';
                }
            }
            lu.append(answerElement);
        });
        answerContainer.append(p);
        answerContainer.append(lu);
        answerContainer.append(timeSpent);
    });
    const totalScoreDiv = document.createElement('div');
    totalScoreDiv.style.padding = '20px';
    const totalTime = document.createElement('span');
    totalTime.innerText = `Total time: ${timeFormatter.timeFormatter(getItemFromStorageAsNumber('TotalQuizTime'))}`;
    const spanScore = document.createElement('span');
    spanScore.style.color = 'red';
    spanScore.style.fontWeight = 'bolder';
    spanScore.style.borderRadius = '50%';
    spanScore.innerHTML = `${countPoints()}/${lastQuestionIndex + 1} <br>`;
    totalScoreDiv.append(spanScore);
    totalScoreDiv.append(totalTime);
    const resetButton = document.createElement('button');
    resetButton.innerText = 'Close';
    resetButton.onclick = () => {
        location.reload();
    };
    resultDialog.append(answerContainer);
    resultDialog.append(resetButton);
    resultDialog.append(totalScoreDiv);
    resultDialog.open = true;
    document.body.append(resultDialog);
}
function createQuestion(index) {
    questionContainer.innerHTML = '';
    const quizQuestions = config.questions;
    const question = quizQuestions[index];
    const questionTitle = document.createElement('h1');
    const questionAnswerContainer = document.createElement('div');
    questionAnswerContainer.id = 'question-answer-container';
    questionTitle.innerText = question.formula;
    question.answers.forEach(answer => {
        const questionAnswerElement = document.createElement('p');
        questionAnswerElement.classList.add('answer');
        questionAnswerElement.innerHTML = '';
        questionAnswerElement.innerText = answer;
        questionAnswerElement.addEventListener('click', (evt) => {
            const asnwersElements = document.querySelectorAll('.answer');
            setTimeout(() => {
                endBtn.disabled = !isQuizDone();
            }, 1);
            asnwersElements.forEach(element => {
                element.removeAttribute('clicked');
            });
            const answer = evt.target;
            answer.setAttribute('clicked', '');
            localStorage.setItem(`Answer ${currentIndex}`, answer.innerText);
        });
        if (questionAnswerElement.innerText === localStorage.getItem(`Answer ${currentIndex}`)) {
            questionAnswerElement.setAttribute('clicked', '');
        }
        questionAnswerContainer.append(questionAnswerElement);
    });
    questionContainer.append(questionTitle);
    questionContainer.append(questionAnswerContainer);
    localStorage.setItem('CurrentQuestionIndex', currentIndex.toString());
    startBtn.disabled = true;
    nextBtn.disabled = false;
}
function setButtonState(button) {
    switch (button) {
        case nextBtn: {
            if (currentIndex >= lastQuestionIndex) {
                nextBtn.setAttribute('disabled', '');
            }
            else {
                nextBtn.removeAttribute('disabled');
                backBtn.removeAttribute('disabled');
            }
            break;
        }
        case backBtn: {
            if (currentIndex === 0) {
                backBtn.setAttribute('disabled', '');
            }
            else {
                backBtn.removeAttribute('disabled');
                nextBtn.removeAttribute('disabled');
            }
            break;
        }
        default: console.warn('Nieobsługiwany typ');
    }
}
function getItemFromStorageAsNumber(name) {
    return parseInt(localStorage.getItem(name));
}
function startCounter(node) {
    const timeFormatter = new TimeFormatter();
    switch (node) {
        case totalTime: {
            let timeS = getItemFromStorageAsNumber(`TotalQuizTime`);
            totalTimeInterval = setInterval(() => {
                ++timeS;
                totalQuizTime = timeS;
                localStorage.setItem('TotalQuizTime', totalQuizTime.toString());
                (node.innerHTML = `${timeFormatter.timeFormatter(timeS)}`);
            }, 1000);
            break;
        }
        case questionTimeNode: {
            let timeS = getItemFromStorageAsNumber(`TimeSpent on Q${currentIndex}`);
            questionTimeInterval = setInterval(() => {
                ++timeS;
                localStorage.setItem(`TimeSpent on Q${currentIndex}`, timeS.toString());
                toggleHideLoader(true);
                (node.innerHTML = `${timeFormatter.timeFormatter(timeS)}`);
            }, 1000);
            break;
        }
        default: console.warn('Undefined type');
    }
}
function stopCounter(currentIntervalId) {
    clearInterval(currentIntervalId);
    questionTimeNode.innerText = '';
    toggleHideLoader(false);
}
function toggleHideLoader(hide) {
    const loader = document.querySelector('.loader');
    loader.hidden = hide;
}
function isQuizDone() {
    let numberAnswered = 0;
    let result = false;
    config.questions.forEach((question, index) => {
        if (localStorage.getItem(`Answer ${index}`)) {
            numberAnswered++;
        }
        else {
            numberAnswered > 0 ? '' : numberAnswered--;
            endBtn.setAttribute('disabled', '');
        }
    });
    if (numberAnswered === config.questions.length) {
        result = true;
    }
    else {
        result = false;
    }
    return result;
}
function countPoints() {
    let points = 0;
    config.questions.forEach((question, index) => {
        if (question.correctAnswer === localStorage.getItem(`Answer ${index}`)) {
            points++;
        }
    });
    return points;
}
