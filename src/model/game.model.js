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
        this.fps = fps;
        this.canvas = null;
        this.ctx = null;
        this.sizes = boardSize
    }

    init(containerSelector, canvasSelector) {

        const container = document.querySelector(containerSelector);
        if (!container) throw new Error(`DOM Element Not Found ${containerSelector}`);

        const canvas = document.querySelector(canvasSelector);
        if (!canvas) throw new Error(`DOM Element Not Found ${canvasSelector}`);
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.refresh();
        setInterval(this.refresh, 1000 / this.fps)

    }

    refresh() {
        this.updateCanvasStyle({height: this.sizes.height, width: this.sizes.width})
    }

    updateCanvasStyle(style) {
        if (!this.canvas || !style) return;

        Object.entries(style).forEach(([key, val]) => {
            this.canvas[key] = val
        })
    }


}

