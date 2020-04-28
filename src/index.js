import {BoardSize} from "@model/game.model";
import "@styles/global.css";
import {TetrisGame} from "@model/tetris.game-model";
const fps = 50;
const pixel =20;
const sizes = new BoardSize( 18,9,pixel,pixel);
const gameInstance = new TetrisGame(fps,sizes);


gameInstance.init("#game-container","#game-canvas");




