import {BoardSize} from "@model/game.model";
import "@styles/global.css";
import {TetrisPiece,Location} from "@model/tetris-piece.model";
import {TetrisGame} from "@model/tetris.game-model";
const fps = 50;
const pixel =10;
const sizes = new BoardSize( 16*3,16,pixel,pixel);
const gameInstance = new TetrisGame(fps,sizes);


gameInstance.init("#game-container","#game-canvas");




