import {Game,BoardSize} from "@model/game.model";
import "@styles/global.css";
import {TetrisPiece,Location} from "@model/tetris-piece.model";
const fps = 50;
const pixel =10
const sizes = new BoardSize(pixel*4*4*2,pixel*4*4,pixel,pixel);
const gameInstance = new Game(fps,sizes);


gameInstance.init("#game-container","#game-canvas");


const piece = new TetrisPiece(gameInstance,'L','blue',new Location(0,0))

piece.angle=3;
piece.draw();

