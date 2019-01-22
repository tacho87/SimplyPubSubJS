import ConsoleMessages from './consolemessages.js';


export default class ReHoardPubSub {

    constructor() {
        this.changeSettings(null);
        this._states = {};
        this._actions_history = [];
        this._storageName = "ReHoard";
        this._persistanceLoad();
        this._willSubscribeWhenAlive = [];
        this._debug;
    }


    changeSettings(settings) {

        this._settings = {
            persistance: {
                persist: (settings && settings.persist ? settings.persist : true),
                session: (settings && settings.session ? settings.session : true),
                timeAlive: (settings && settings.timeAlive ? settings.timeAlive : 1)
            },
            undoRedo: (settings && settings.undoRedo ? settings.undoRedo : true),
            actionsHistory: (settings && settings.actionsHistory ? settings.actionsHistory : true),
            actionsHistoryLimit: (settings && settings.actionsHistoryLimit ? settings.actionsHistoryLimit : 100),
            typeMutable: (settings && settings.typeMutable ? settings.typeMutable : false),
            production: (settings && settings.production ? settings.production : true)
        };

        try {
            let test = sessionStorage || localStorage;
        } catch (e) {
            this._settings.persist = false;
            this._settings.persist = false;
        }
        this._debug = new ConsoleMessages(this._settings.production);
    }

    dispatch(stateName, stateValue, actionReference = "") {
        let success = false;

        if (!stateName || !stateValue) {
            this._debug.error("Null parameters dispatched ");
            return success;
        }
        if (typeof actionReference !== "string") {
            this._debug.error("An action must be a string type");
            return success;
        }

        if (this._states.hasOwnProperty(stateName)) {
            let state = this._states[stateName];

            this._update(state, stateName, stateValue, actionReference);
            this._notifysubscribers(state);

            success = true;
        } else {

            this._create(stateName, stateValue, actionReference);

            success = true;
        }


        this._persistanceSave();

        return success;
    }

    subscribeWhenBecomesAlive(stateName, listener, unSubscribeCB = null) {

        if (this._states.hasOwnProperty(stateName) && listener)
            return this.subscribe(stateName, listener, unSubscribeCB);
        else
            return this._willSubscribeWhenAlive.push({ name: stateName, listener: listener, unSubscribeCB: unSubscribeCB });
    }

    subscribe(stateName, listener, unSubscribeCB) {
        if (this._states.hasOwnProperty(stateName) && listener) {

            let state = this._states[stateName];

            let uniqueId = Date.now();

            state.subscribers.push({
                listener: listener,
                unSubscribeCB: () => this._unSubscribe(stateName, uniqueId),
                uniqueId: uniqueId
            });

            this._a_history(state, "Listener Subscribed");

            this._notifysubscribers(state);

            return {
                unSubscribe: () => this._unSubscribe(stateName, uniqueId)
            };

        } else {
            this._debug.warn(stateName + " does not exits yet... Cannot subscribe... :(");

            return false;
        }
    }

    broadcastState(stateName) {

        let success = false;

        if (this._states.hasOwnProperty(stateName)) {
            let state = this._states[stateName];
            this._notifysubscribers(state);
            success = true;

        } else {
            this._debug.warn("broadcastState failed to find state, check your state name")
        }
        return success;
    }


    getCurrentValue(stateName) {
        if (this._states.hasOwnProperty(stateName)) {
            let state = this._states[stateName];
            return state.value;
        } else {
            return null;
        }
    }


    deleteState(stateName) {
        let success = false;
        if (this._states.hasOwnProperty(stateName)) {
            this._a_history(this._states[stateName], "State Deleted");
            this._persistanceSave();
            delete this._states[stateName];
            success = !this._states[stateName];
        } else {
            this._debug.error(stateName + " does not exits yet... Cannot delete");
        }
        return success;
    }

    redo(stateName) {
        let success = false;
        if (this._settings.undoRedo && stateName && this._states.hasOwnProperty(stateName)) {
            let state = this._states[stateName];
            if (state.redoStack.length > 0) {
                state.undoStack.push({ value: state.value, action: state.actionReference });
                let s = state.redoStack.pop();
                state.value = s.value;
                state.actionReference = s.actionReference;
                this._a_history(state, "Redo");
                this.broadcastState(stateName);
                this._persistanceSave();
                success = true;
            }
        }
        return success;

    }

    undo(stateName) {
        let success = false;
        if (this._settings.undoRedo && stateName && this._states.hasOwnProperty(stateName)) {
            let state = this._states[stateName];
            if (state.undoStack.length > 0) {
                state.redoStack.push({ value: state.value, action: state.actionReference });
                let s = state.undoStack.pop();
                state.value = s.value;
                state.actionReference = s.actionReference;
                this._a_history(state, "Undo");
                this.broadcastState(stateName);
                this._persistanceSave();
                success = true;
            }

        }
        return success;
    }

    getStatesNames() {
        let states = [];
        for (var property in this._states) {
            states.push(property);
        }
        return states;
    }



    //Private

    _unSubscribe(stateName, uniqueId) {
        let success = false;
        if (this._states.hasOwnProperty(stateName) && stateName && uniqueId) {
            let state = this._states[stateName];
            state.subscribers = state.subscribers.filter((e) => e.uniqueId !== uniqueId);
            this._a_history(state, "unSubcribed");
            success = true;
        }
        else {
            this._debug.warn(stateName + " does not exits yet... Cannot unSubcribe... :(");
        }
        return success;
    }

    _create(stateName, stateValue, actionReference) {
        let state = this._states[stateName] = {};

        state.typeOfElement = typeof stateValue;
        state.name = stateName;
        state.value = stateValue;
        if (this._willSubscribeWhenAlive.length > 0) {
            this._willSubscribeCore(state);
        } else {
            state.subscribers = [];
        }
        state.action = actionReference;

        if (this._settings.undoRedo) {
            state.undoStack = [];
            state.redoStack = [];
        }
        this._notifysubscribers(state);
        this._a_history(state, "Created");
    }



    _update(state, stateName, stateValue, actionReference) {
        if (!this._settings.typeMutable) {
            if (state.typeOfElement !== typeof stateValue) {
                this._debug.error("Error, mutability violated for: " + state.name);
                return;
            }
        } else {
            state.typeOfElement = typeof stateValue;
        }
        if (this._settings.undoRedo) {
            if (state.undoStack.length >= 100) {
                state.undoStack.splice(parseInt(0, parseInt(state.undoStack.length / 2)));
            }
            state.undoStack.push({ value: state.value, action: state.actionReference });
            state.redoStack = [];
        }
        state.value = stateValue;
        state.action = actionReference;
        this._a_history(state, "Updated");
    }

    _willSubscribeCore(state) {
        //TODO: Refactor, 4X O(N)

        //Extract will subcribe for this instance
        let jedis = this._willSubscribeWhenAlive.filter((e) => { return e.name === state.name; });

        //Remove jedis and update new queue.... BUG HERE
        // this._willSubscribeWhenAlive = this._willSubscribeWhenAlive.filter((e) => { return jedis.indexOf(e) < 0 })

        //Append to subscriber
        state.subscribers = jedis.map((e) => {
            return {
                listener: e.listener,
                unSubscribeCB: e.unSubscribeCB,
                uniqueId: Date.now()
            }
        });
        //Notify new unsubcribe method.
        state.subscribers.forEach((e, i) => {
            try {
                if (e.unSubscribeCB) {
                    e.unSubscribeCB({
                        unSubscribe: () => { this._unSubscribe(e.name, uniqueId) }
                    });
                }
            } catch (o) {
                this._debug.warn(o);
            }
        })

    }

    _notifysubscribers(state) {
        if (state && state.subscribers.length > 0) {
            for (var i = 0; i < state.subscribers.length; i++) {
                if (state.subscribers[i] && state.subscribers[i].listener !== null) {

                    setTimeout(function (opt, value) {
                        try {
                            opt.listener(value);
                        } catch (e) {
                            this._debug.error(e);
                        }
                    }.bind(this, state.subscribers[i], state.value)
                    , 0);

                }
            }
        }
        this._a_history(state, "Notified Subscribers");



    }

    _persistanceSave() {
        try {
            if (this._settings.persistance.persist) {
                let storage;
                if (this._settings.persistance.session) {
                    storage = sessionStorage;
                } else {
                    storage = localStorage;
                }
                try {
                    let data = {
                        date: new Date(),
                        states: this._states
                    };
                    storage.setItem(this._storageName, JSON.stringify(data));
                } catch (e) {
                    this._debug.log(e);
                }
            }
        } catch (e) {
            this._debug.log(e);
        }
    }

    _persistanceLoad() {
        try {
            if (this._settings.persistance.persist) {
                let storage;
                if (this._settings.persistance.session) {
                    storage = sessionStorage;
                } else {
                    storage = localStorage;
                }
                try {
                    let results = storage.getItem(this._storageName);
                    if (results) {
                        let data = JSON.parse(results);
                        let date = new Date(data.date);
                        date.setDate(date.getDate() + this._settings.timeAlive);
                        if (date < new Date()) {
                            storage.removeItem(this._storageName);
                        } else {

                            let s = Object.assign({}, data.states);
                            for (let x in s) {
                                s[x].subscribers = [];
                            }
                            this._states = s;
                        }
                    }
                } catch (e) {
                    this._debug.log(e);
                }
            }
        }
        catch (e) {
            this._debug.log(e);
        }
    }

    _a_history(state, action) {
        if (this._settings.actionsHistory) {
            if (this._actions_history.length >= this._settings.actionsHistoryLimit) {
                this._actions_history.splice(parseInt(0, parseInt(this._actions_history.length / 2)));
            }
            this._actions_history.push({
                action: action,
                state: Object.assign({}, state),
                date: new Date()
            });
        }
    }
}



