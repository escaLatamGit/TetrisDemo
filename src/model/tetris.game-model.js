import {BoardSize, Game} from "@model/game.model";
import {KeyBoardManager} from "@model/key-board-manager.model";
import {Location, pieceSize, TetrisPiece, validPieces} from "@model/tetris-piece.model";
import colorList from '@ref/piece-colors.reference'

export class TetrisGame extends Game {

    constructor(fps, panel = new BoardSize(20, 10), colors = colorList, acceleration = 0.3) {
        const sizes = new BoardSize(panel.height * panel.pixelHeight, panel.width * panel.pixelWidth, panel.pixelHeight, panel.pixelWidth);
        super(fps, sizes);
        this.currPiece = null;
        this.keyListener = new KeyBoardManager();
        this.speed = 1; //1 pos/sec
        this.acceleration = acceleration;
        this.panel = {
            size: panel,
            value: [],
            margin: {top: pieceSize, bottom: 1, left: 1, right: 1},
            bounds: {top: pieceSize, bottom: 1, left: 1, right: 1},
        };
        this.colors = colors;
        this.score = 0;
        this.gameEnd = false;
    }

    refresh() {
        super.refresh();
    }

    reset() {
        this.currPiece = null;
        this.speed = 1;
        this.panel.value = [];
        this.score = 0;
        this.gameEnd = false;
    }

    getRandomColor() {
        return this.colors[Math.floor(1 + Math.random() * (this.colors.length - 1))];
    }

    getRandomPieceName() {
        return validPieces[Math.floor(Math.random() * validPieces.length)];
    }

    getRandomPiece() {
        let pieceName = this.getRandomPieceName();
        while (this.currPiece && pieceName === this.currPiece.type) {
            pieceName = this.getRandomPieceName();
        }
        let color = this.getRandomColor();
        while (this.currPiece && color === this.currPiece.color) {
            color = this.getRandomColor();
        }
        const x = Math.floor(Math.random() * (this.panel.size.width - pieceSize));
        return new TetrisPiece(this, pieceName, color, new Location(x, -pieceSize));
    }


    init(canvasSelector) {
        super.init(canvasSelector);
        super.attachToRefresh(() => this.draw());
        let updateFrameCounter = 0;
        super.attachToRefresh(() => {
            if (this.gameEnd) return;
            if (++updateFrameCounter > Math.floor(this.fps / this.speed)) {
                updateFrameCounter = 0;
                const lastY = this.currPiece.location.y;
                this.currPiece.moveDown();
                this.currPiece && this.currPiece.draw();
                if (lastY === this.currPiece.location.y) {
                    this.freezePieceLocation(this.currPiece);
                    this.isOver();
                    this.currPiece = this.getRandomPiece();
                    this.speed += this.acceleration;
                    const lineCount = this.resolveMatches();
                    if (lineCount) {
                        this.score += Math.floor(lineCount * this.speed);
                        console.log(this.score)
                    }
                }
            }
            this.currPiece && this.currPiece.draw();
        });
        super.attachToRefresh(() => {
            if (!this.gameEnd) return;
            if (++updateFrameCounter > Math.floor(this.fps / this.speed)) {
                const panelMap = this.panel.value;
                for (const y in panelMap) {
                    for (const x in panelMap[y]) {
                        if (!this.isVisible(parseInt(y), parseInt(x))) continue;
                        this.panel.value[y][x] = this.colors.indexOf(this.getRandomColor());

                    }
                }
            }
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

    isOver() {
        if (this.gameEnd) return this.gameEnd;

        const limit = this.panel.value[this.panel.bounds.top];
        const bounds = this.panel.bounds;
        this.gameEnd = limit.map((val, x) => (x > bounds.left && x < bounds.right && val > 0)).reduce((all, val) => all || val, false);
        return this.gameEnd;
    }

    freezePieceLocation(piece) {
        const {location, color} = piece;
        if (this.colors.indexOf(color) < 0) this.colors.push(color);
        const label = this.colors.indexOf(color);
        const pieceMap = piece.snapshots[piece.angle];
        for (const y in pieceMap) {
            for (const x in pieceMap[y]) {
                if (!pieceMap[y][x]) continue;
                const {x: iX, y: iY} = this.reversePosition(location.y + parseInt(y), location.x + parseInt(x));
                this.panel.value[iY][iX] = label;
            }
        }
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
    }

    isVisible(y, x) {
        if (!this.panel?.value?.length) this.definePanel();
        return x > this.panel.bounds.left && x < this.panel.bounds.right && y > this.panel.bounds.top && y < this.panel.bounds.bottom
    }

    getPosition(y, x) {
        if (!this.panel?.value?.length) this.definePanel();
        return {x: x - this.panel.margin.left, y: y - this.panel.margin.top}
    }

    reversePosition(y, x) {
        if (!this.panel?.value?.length) this.definePanel();
        return new Location(x + this.panel.margin.left, y + this.panel.margin.top)
    }

    isValidPosition(location, piece) {
        for (const y in piece) {
            for (const x in piece[y]) {
                if (!piece[y][x]) continue;
                const {x: iX, y: iY} = this.reversePosition(location.y + parseInt(y), location.x + parseInt(x));
                if (!this.panel.value[iY] || this.panel.value[iY][iX]) return false
            }
        }
        return true;
    }

    resolveMatches() {
        if (!this.panel?.value?.length) this.definePanel();
        const cleanStack = [];
        const panelMap = [...this.panel.value.map(row => [...row])];
        const firstRowTemplate = [...panelMap[0]];
        for (const y in panelMap) {
            let isFullFilled = true;
            let isVisible = false;
            for (const x in panelMap[y]) {
                if (!this.isVisible(parseInt(y), parseInt(x))) continue;
                isFullFilled = isFullFilled && !!panelMap[y][x];
                isVisible = true;
            }
            if (isFullFilled && isVisible) {
                cleanStack.unshift(y);
            }
        }
        for (const pos of cleanStack) {
            panelMap.splice(pos, 1)
        }
        for (const pos of cleanStack) {
            panelMap.unshift(firstRowTemplate)
        }
        this.panel.value = panelMap;
        return cleanStack.length;
    }

    draw() {

        if (!this.panel?.value?.length) this.definePanel();
        const panelMap = this.panel.value;
        for (const y in panelMap) {
            for (const x in panelMap[y]) {
                if (!this.isVisible(parseInt(y), parseInt(x))) continue;
                const {x: iX, y: iY} = this.getPosition(y, x);
                this.ctx.fillStyle = this.colors[panelMap[y][x]];
                this.ctx.fillRect(
                    (iX) * this.sizes.pixelWidth,
                    (iY) * this.sizes.pixelHeight,
                    this.sizes.pixelWidth,
                    this.sizes.pixelHeight)

            }
        }
    }
}
