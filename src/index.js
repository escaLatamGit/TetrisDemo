import {BoardSize} from "@model/game.model";
import "@style/global.scss";
import {TetrisGame} from "@model/tetris.game-model";
import {pieceSize} from "@model/tetris-piece.model";

const fps = 50;
const BaseBlocks = 5;
const HeightBlocks = 8;
const pixel = Math.floor(window.innerHeight / (HeightBlocks * pieceSize) * 0.8);
const sizes = new BoardSize(HeightBlocks * pieceSize, BaseBlocks * pieceSize, pixel, pixel);
const gameInstance = new TetrisGame(fps, sizes);


gameInstance.init("#game-container", "#game-canvas");




