export class KeyBoardManager {


    constructor() {
        this._id = 0;
        this.keyListeners = {
            'keydown': {},
            'keyup': {},
            'keypress': {}
        }
    }

    addListener(type, keyName, callback) {
        if (!this.keyListeners[type][keyName]) this.keyListeners[type][keyName] = {};
        this.keyListeners[type][keyName][++this._id] = callback;
        return this._id;
    }

    removeListener(type, keyName, index) {
        if (this.keyListeners[type][keyName])
            delete this.keyListeners[type][keyName][index];
    }

    init() {
        Object.keys(this.keyListeners).forEach((eventName) => {
            document.addEventListener(eventName, (event) => {
                console.log(eventName, event.key, event);
                this.resolve(eventName, event)
            })
        })
    }

    resolve(type, event) {
        const stack = this.keyListeners[type][event.key] || [];
        Object.values(stack).forEach(callback => callback(event))
    }

}
