import {Game,BoardSize} from "@model/game.model";
import "@styles/global.css";
const fps = 50;
const sizes = new BoardSize(800,400);
const gameInstance = new Game(fps,sizes);


gameInstance.init("#game-container","#game-canvas");

