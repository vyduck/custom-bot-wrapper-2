import { Handler } from "./handler.js";

export class HookHandler extends Handler{
    constructor({ handler, hName, eName }) {
        super({ handler, hName, eName });
    }

    get when() {
        return this.eName;
    }
}