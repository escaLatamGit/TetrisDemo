import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

const init = function () {
    const fps = 50;
    const pixel = 30;
    const container = document.querySelector(".tv-screen");
    const width = Math.floor((container.offsetWidth - 40) / pieceSize / pixel) * pieceSize * pixel; 
    console.log(width / pixel, width / pixel);
    const sizes = new BoardSize(width / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame(fps, sizes);
    gameInstance.init( "#game-canvas");
    return gameInstance
};

let instance = init();
let resizeTrigger = null;
let awaitResize = function(){
    if (resizeTrigger)
        clearTimeout(resizeTrigger)
    resizeTrigger = setTimeout(()=>{
        resizeTrigger = null;
        instance.destroy();
        instance = init();
    },200)
}
window.addEventListener('resize', function () {
    awaitResize();
});

