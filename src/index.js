import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

const init = function () {
    const fps = 50;
    const pixel = 10;
    const container = document.querySelector(".tv-screen");
    const width = Math.floor((container.offsetWidth - 40) / pieceSize / pixel) * pieceSize * pixel;
    const height = width;
    console.log(height / pixel, width / pixel);
    const sizes = new BoardSize(height / pixel, width / pixel, pixel, pixel);
    const gameInstance = new TetrisGame(fps, sizes);
    gameInstance.init( "#game-canvas");
};
init();
document.addEventListener('resize', function () {
    init();
});

