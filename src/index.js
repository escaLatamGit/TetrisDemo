import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

const fps = 50;
const BaseBlocks = 10;
const HeightBlocks = 10;
const pixel = Math.floor(window.innerHeight / (HeightBlocks * pieceSize) * 0.5);
const sizes = new BoardSize(HeightBlocks * pieceSize, BaseBlocks * pieceSize, pixel, pixel);
const gameInstance = new TetrisGame(fps, sizes);


gameInstance.init("#game-container", "#game-canvas");




