import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

let instance;
let resizeTrigger;
let gameState = {
    started: false,
    score: 0,
    gameEnd: false
};
const fps = 50;
const pixel = 30;
const btnContainer = document.querySelector("#start-btn");
const scoreContainer = document.querySelector("#score-container");
const container = document.querySelector(".tv-screen");

const endListener = ({gameEnd} = {gameEnd: true}) => {
    gameState.gameEnd = gameEnd;
    btnContainer.innerHTML = gameEnd ? 'On' : 'Off';
    console.log(  btnContainer.classList);
    btnContainer.classList.remove(gameEnd ? 'tv-off' : 'tv-on');
    btnContainer.classList.add(gameEnd ? 'tv-on' : 'tv-off');
    console.log(  btnContainer.classList);
}

const scoreListener = ({score}) => {
    scoreContainer.innerHTML = score;
};

const startGame = function () {
    if (!gameState.started || instance.gameEnd) {
        gameState.started = true;
        gameState.gameEnd = false;
        gameState.score = 0;
        if (instance) instance.destroy();
        instance = start();
        return;
    }
    instance.gameEnd = true;
    endListener(instance);
};
const load = function () {
    const width = Math.floor((container.offsetWidth - 40) / pieceSize / pixel) * pieceSize * pixel;
    const sizes = new BoardSize(width / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame("#game-canvas", fps, sizes);
    gameInstance.addStateChangeListener(scoreListener);
    gameInstance.addStateChangeListener(endListener);
    scoreListener({score: '0000'});
    endListener();
    gameInstance.init();
}
const start = function () {
    gameState.started = true;
    const width = Math.floor((container.offsetWidth) / pieceSize / pixel) * pieceSize * pixel;
    const height = Math.floor((container.offsetHeight) / pieceSize / pixel) * pieceSize * pixel;
    const sizes = new BoardSize(height / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame("#game-canvas", fps, sizes);
    gameInstance.addStateChangeListener(scoreListener);
    gameInstance.addStateChangeListener(endListener);
    scoreListener({score: '0000'});
    endListener(gameInstance);
    gameInstance.start();
    return gameInstance;
};

let awaitResize = function () {
    if (!instance) return;
    if (resizeTrigger)
        clearTimeout(resizeTrigger)
    resizeTrigger = setTimeout(() => {
        resizeTrigger = null;
        instance.destroy();
        instance = start();
    }, 200)
}
window.addEventListener('resize', function () {
    awaitResize();
});

load();

btnContainer.addEventListener('click', startGame)