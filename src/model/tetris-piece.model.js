import {Game} from "@model/game.model";
import pieces from '@ref/tetris-pieces.reference';

export const pieceSize = Object.values(pieces)[0].length;
export const validPieces = Object.keys(pieces);
export class Location {
    constructor(x = 0, y = 0) {
        this.x = x;
        this.y = y;
    }

}

export class TetrisPiece {

    constructor(GameModel = new Game(), type = null, color = null, location = new Location()) {
        this.game = GameModel;
        this.type = type;
        this.location = location;
        this.angle = 0;
        this.snapshots = [pieces[type]];
        while (this.snapshots.length < 4) {
            this.snapshots.push(this.rotatePiece(this.snapshots[this.snapshots.length - 1]))
        }
        this.color = color;
    }

    move(xInc = 0, yInc = 0) {
        if (xInc)
            this.location.x += xInc;
        if (yInc)
            this.location.y += yInc;

    }

    moveLeft(inc = 1) {
        this.move(-inc, 0);
    }

    moveRight(inc = 1) {

        this.move(inc, 0);
    }

    moveUp(inc = 1) {

        this.move(0, -inc);
    }

    moveDown(inc = 1) {

        this.move(0, inc);
    }

    draw() {
        const pieceMap = this.snapshots[this.angle];
        if (!pieceMap) throw new Error(`Invalid Piece type found ${this.type}`);
        for (const y in pieceMap) {
            for (const x in pieceMap[y]) {
                if (!pieceMap[y][x]) continue;
                this.game.ctx.fillStyle = this.color;
                this.game.ctx.fillRect(
                     (this.location.x + parseInt(x) ) * this.game.sizes.pixelWidth,
                     (this.location.y + parseInt(y) ) * this.game.sizes.pixelHeight,
                    this.game.sizes.pixelWidth,
                    this.game.sizes.pixelHeight)

            }
        }
    }

    rotate(clockwise = true) {
        let angle = this.angle + (clockwise ? 1 : -1);
        if (angle < 0) angle = angle + 4;
        this.angle = angle % 4;
        return this.angle;
    }

    rotatePiece(pieceMap) {
        const rotatedMap = [];
        if (!pieceMap.length || !pieceMap[0].length) throw new Error(`Invalid Matrix found at ${JSON.stringify(pieceMap)}`);
        rotatedMap.length = pieceMap[0].length;
        for (const y in pieceMap) {
            for (const x in pieceMap[y]) {
                if (!rotatedMap[x]) rotatedMap[x] = [];
                rotatedMap[x].unshift(pieceMap[y][x]);
            }
        }
        return rotatedMap;
    }
}
