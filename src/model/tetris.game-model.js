import {Game} from "@model/game.model";
import {KeyBoardManager} from "@model/key-board-manager.model";
import {Location, TetrisPiece} from "@model/tetris-piece.model";

export class TetrisGame extends Game {

    constructor(fps, sizes) {
        super(fps, sizes);
        this.currPiece = null;
        this.keyListener = new KeyBoardManager()

    }

    refresh() {
        super.refresh();
    }

    init(containerSelector, canvasSelector) {
        super.init(containerSelector, canvasSelector);
        super.attachToRefresh(() => this.currPiece && this.currPiece.draw());
        this.currPiece = new TetrisPiece(this, 'L', 'purple', new Location(0, 0));
        this.keyListener.init();
        this.keyListener.addListener('keydown', 'ArrowUp', () => {
            if (!this.currPiece) return;
            this.currPiece.rotate();
        });
        this.keyListener.addListener('keydown', 'ArrowLeft', () => {
            if (!this.currPiece) return;
            this.currPiece.moveLeft(this.sizes.pixelWidth);
        });
        this.keyListener.addListener('keydown', 'ArrowDown', () => {
            if (!this.currPiece) return;
            this.currPiece.moveDown(this.sizes.pixelHeight/2);
        });
        this.keyListener.addListener('keydown', 'ArrowRight', () => {
            if (!this.currPiece) return;
            this.currPiece.moveRight(this.sizes.pixelWidth);
        });
    }
}
