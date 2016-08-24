export default class ConsoleMessages {
    constructor(production = false) {
        this.production = production;
    }
    changeEnviroment(production = false) {
        this.production = production
    }
    error(text) {
        if (this.production) return;
        console.error(text);
    }
    warn(text) {
        if (this.production) return;
        console.error(text);
    }
    info(text) {
        if (this.production) return;
        console.error(text);
    }
    log(text) {
        if (this.production) return;
        console.error(text);
    }
    debug(text) {
        if (!this.production) return;
        console.error(text);
    }
}
