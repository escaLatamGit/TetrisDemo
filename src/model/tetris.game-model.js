import {BoardSize, Game} from "@model/game.model";
import {KeyBoardManager} from "@model/key-board-manager.model";
import {Location, pieceSize, TetrisPiece, validPieces} from "@model/tetris-piece.model";

export class TetrisGame extends Game {

    constructor(fps, panel = new BoardSize(20, 10), color = '#436315') {
        const sizes = new BoardSize(panel.height * panel.pixelHeight, panel.width * panel.pixelWidth, panel.pixelHeight, panel.pixelWidth);
        super(fps, sizes);
        this.currPiece = null;
        this.keyListener = new KeyBoardManager();
        this.speed = 1; //1 pos/sec
        this.panel = {
            size: panel,
            value: [],
            margin: {top: pieceSize, bottom: 1, left: 1, right: 1},
            bounds: {top: pieceSize, bottom: 1, left: 1, right: 1},
        };
        this.color = color
    }

    refresh() {
        super.refresh();
    }

    getRandomPiece() {

        const pieceName = validPieces[Math.floor(Math.random() * validPieces.length)];
        const x = Math.floor(Math.random() * (this.panel.size.width - pieceSize));
        return new TetrisPiece(this, pieceName, 'purple', new Location(x, 0));
    }

    init(containerSelector, canvasSelector) {
        super.init(containerSelector, canvasSelector);
        super.attachToRefresh(() => this.draw());
        let updateFrameCounter = 0;
        super.attachToRefresh(() => {
            if (++updateFrameCounter > Math.floor(this.fps / this.speed)) {
                updateFrameCounter = 0;
                this.currPiece.moveDown();
            }
            this.currPiece && this.currPiece.draw();
        });
        this.currPiece = this.getRandomPiece();
        this.keyListener.init();
        this.keyListener.addListener('keydown', 'ArrowUp', () => {
            if (!this.currPiece) return;
            this.currPiece.rotate();
        });
        this.keyListener.addListener('keydown', 'ArrowLeft', () => {
            if (!this.currPiece) return;
            this.currPiece.moveLeft();
        });
        this.keyListener.addListener('keydown', 'ArrowDown', () => {
            if (!this.currPiece) return;
            this.currPiece.moveDown();
        });
        this.keyListener.addListener('keydown', 'ArrowRight', () => {
            if (!this.currPiece) return;
            this.currPiece.moveRight();
        });
    }

    definePanel() {
        if (!this.panel.value?.length)
            this.panel.value = [];

        const {size, margin} = this.panel;
        const height = size.height + margin.top + margin.bottom;
        const width = size.width + margin.left + margin.bottom;
        this.panel.bounds = {
            top: margin.top - 1,
            bottom: height - margin.bottom,
            left: margin.left - 1,
            right: width - margin.right
        };

        while (height > this.panel.value.length) {
            let row = [];
            const bottom = this.panel.value.length >= this.panel.bounds.bottom;
            while (width > row.length) row.push(bottom || row.length <= this.panel.bounds.left || row.length >= this.panel.bounds.right ? 1 : 0);
            this.panel.value.push(row)
        }
        console.log(this.panel.value);
        console.log(this.panel.bounds)
    }

    isVisible(y, x) {
        if (!this.panel?.value?.length) this.definePanel();
        return x > this.panel.bounds.left && x < this.panel.bounds.right && y > this.panel.bounds.top && y < this.panel.bounds.bottom
    }

    getPosition(y, x) {
        if (!this.panel?.value?.length) this.definePanel();
        return {x: x - this.panel.margin.left, y: y - this.panel.margin.top}
    }

    isValidPosition(location, piece) {
        for (const y in piece) {
            for (const x in piece[y]) {
                if (!piece[y][x]) continue;
                const iX = location.x + parseInt(x) + this.panel.margin.left
                const iY = location.y + parseInt(y) + this.panel.margin.top
                if (!this.panel.value[iY] || this.panel.value[iY][iX]) return false
            }
        }
        return true;
    }

    draw() {

        if (!this.panel?.value?.length) this.definePanel();
        const panelMap = this.panel.value;
        for (const y in panelMap) {
            for (const x in panelMap[y]) {
                if (!panelMap[y][x] || !this.isVisible(y, x)) continue;
                const {x: iX, y: iY} = this.getPosition(y, x);
                // console.log({x, y, iX, iY});
                this.ctx.fillStyle = this.color;
                this.ctx.fillRect(
                    (iX) * this.sizes.pixelWidth,
                    (iY) * this.sizes.pixelHeight,
                    this.sizes.pixelWidth,
                    this.sizes.pixelHeight)

            }
        }
    }
}
