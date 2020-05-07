import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

let instance;
let resizeTrigger;
const fps = 50;
const pixel = 30;

const endListener = ({gameEnd} = {gameEnd: true}) => {
    const btnContainer = document.querySelector("#start-btn");
    btnContainer.innerHTML = gameEnd?'On':'Off';
}

const scoreListener = ({score}) => {
    const scoreContainer = document.querySelector("#score-container");
    scoreContainer.innerHTML = score;
};

const load = function () {
    const container = document.querySelector(".tv-screen");
    const width = Math.floor((container.offsetWidth - 40) / pieceSize / pixel) * pieceSize * pixel;
    const sizes = new BoardSize(width / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame("#game-canvas",fps, sizes);
    gameInstance.addStateChangeListener(scoreListener);
    gameInstance.addStateChangeListener(endListener);
    scoreListener({score:'0000'});
    endListener();
    gameInstance.init();
    instance = gameInstance;
}


const start = function () {
    const container = document.querySelector(".tv-screen");
    const width = Math.floor((container.offsetWidth - 40) / pieceSize / pixel) * pieceSize * pixel;
    const sizes = new BoardSize(width / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame("#game-canvas",fps, sizes);
    gameInstance.addStateChangeListener(scoreListener);
    gameInstance.addStateChangeListener(endListener);
    scoreListener({score:'0000'});
    endListener();
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