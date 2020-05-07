export class BoardSize {
    constructor(height = 700, width = 500, pixelHeight = 50, pixelWidth) {
        this.height = height;
        this.width = width;
        this.pixelHeight = pixelHeight;
        this.pixelWidth = pixelWidth || pixelHeight
    }
}

export class Game {

    constructor(fps, boardSize = new BoardSize()) {
        this._id = 0;
        this.fps = fps;
        this.canvas = null;
        this.ctx = null;
        this.sizes = boardSize;
        this.fpsAttach = [];
        this._interval = null;
    }

    init(canvasSelector) {

        const canvas = document.querySelector(canvasSelector);
        if (!canvas) throw new Error(`DOM Element Not Found ${canvasSelector}`);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.refresh();
        const self = this;
        this._interval = setInterval(() => self.refresh(), 1000 / self.fps)

    }

    destroy() {
        this._id = 0;
        this.fps = null;
        this.canvas = null;
        this.ctx = null;
        this.fpsAttach = [];
        if (this._interval)
            clearInterval(this._interval)
    }

    refresh() {
        this.updateCanvasStyle({height: this?.sizes?.height, width: this?.sizes?.width});
        this.fpsAttach.forEach(({id, event}) => event(this))
    }

    attachToRefresh(callback) {
        this.fpsAttach.push({id: this._id++, event: callback});
        return this._id;
    }

    updateCanvasStyle(style) {
        if (!this.canvas || !style) return;

        Object.entries(style).forEach(([key, val]) => {
            this.canvas[key] = val
        })
    }


}

