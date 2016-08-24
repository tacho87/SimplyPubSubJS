import { ReHoardPubSub } from "./components/rehoardpubsub.js";



class ReHoardInit {
    constructor(settings) {
        this._reHoardPubSub = new ReHoardPubSub(settings);
        window.StateHub = this;
    }
    changeSettings(settings) {
        this._reHoardPubSub.changeSettings(settings);
    }
    dispatch(stateName, stateValue, actionReference = "") {
        return this._reHoardPubSub.dispatch(stateName, stateValue, actionReference);
    }
    subscribe(stateName, listener) {
        return this._reHoardPubSub.subscribe(stateName, listener);
    }
    subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB) {
        return this._reHoardPubSub.subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB);
    }
    getCurrentState(stateName) {
        return this._reHoardPubSub.getCurrentState(stateName);
    }
    deleteState(stateName) {
        return this._reHoardPubSub.deleteState(stateName);
    }
    redo(stateName) {
        return this._reHoardPubSub.redo(stateName);
    }
    undo(stateName) {
        return this._reHoardPubSub.undo(stateName);
    }
}



export default (function ReHoard(settings) {
    if (!window.ReHoard) {
        return new ReHoard(settings);
    } else {
        return window.ReHoard;
    }
})();
